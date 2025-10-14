// Lightweight API client for HikIntegrationAPI

export type LoginResponse = { token?: string; accessToken?: string } | string;

export type VideoDownloadRequest = {
    channel: number;
    dayWithTime: string; // ISO string or yyyy-MM-ddTHH:mm
    durationInMinutes: number;
};

const DEFAULT_BASE_URL = typeof window !== "undefined" && (window as any).ENV?.API_BASE_URL
    ? (window as any).ENV.API_BASE_URL
    : (import.meta as any).env?.VITE_API_BASE_URL || "";

export const API_BASE_URL: string = DEFAULT_BASE_URL;

// Demo mode: when true, API calls return mock data and local sample video
export const DEMO_MODE: boolean = (() => {
    try {
        const winFlag = typeof window !== "undefined" ? (window as any).ENV?.DEMO_MODE : undefined;
        if (typeof winFlag === "boolean") return winFlag;
        const envFlag = (import.meta as any).env?.VITE_DEMO_MODE;
        return envFlag === true || envFlag === "true" || envFlag === "1";
    } catch { return false; }
})();

function getAuthToken(): string | null {
    try {
        // Prefer dedicated token key; fallback to token stored in user shape
        const direct = localStorage.getItem("cvd_token");
        if (direct) return direct;
        const storedUser = localStorage.getItem("cvd_auth_user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && typeof parsed.token === "string") return parsed.token as string;
        }
    } catch { }
    return null;
}

function buildUrl(path: string): string {
    if (!API_BASE_URL) return path; // relative to same origin
    return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        ...(init.headers as Record<string, string> | undefined),
    };
    if (!headers["Content-Type"] && init.body && !(init.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    const isLoginEndpoint = typeof input === "string" && /\/api\/Auth\/login$/i.test(input);
    if (token && !isLoginEndpoint && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(buildUrl(input), { ...init, headers });
    if (!response.ok) {
        // Try to surface error message from JSON if available
        let message = `${response.status} ${response.statusText}`;
        try {
            const data = await response.clone().json();
            if (data && (data.message || data.error)) {
                message = (data.message || data.error) as string;
            }
        } catch { }
        throw new Error(message);
    }
    return response;
}

export async function loginRequest(username: string, password: string): Promise<string> {
    if (DEMO_MODE) {
        return "demo-token";
    }
    try {
        const res = await apiFetch("/api/Auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            // No bearer for login
            headers: { "Content-Type": "application/json" },
        });

        // Some backends return raw string, others return { token }
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
            const data: LoginResponse = await res.json();
            if (typeof data === "string") return data;
            if (typeof (data as any).token === "string") return (data as any).token as string;
            if (typeof (data as any).accessToken === "string") return (data as any).accessToken as string;
            throw new Error("Unexpected login response shape");
        } else {
            const text = await res.text();
            if (text) return text;
            throw new Error("Empty login response");
        }
    } catch (err) {
        // In live mode, do not silently fall back
        if (DEMO_MODE) return "demo-token";
        throw (err instanceof Error ? err : new Error("Login failed"));
    }
}

export type StreamingChannel = {
    id: string;
    channelName?: string;
    enabled?: string | boolean;
    Transport?: unknown;
    Video?: {
        enabled?: string | boolean;
        dynVideoInputChannelID?: string;
        videoCodecType?: string;
        videoResolutionWidth?: string;
        videoResolutionHeight?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
};

export async function getChannels(): Promise<StreamingChannel[]> {
    if (DEMO_MODE) return MOCK_CHANNELS;
    try {
        const res = await apiFetch("/api/Videos/GetChannels", { method: "GET" });
        const data = await res.json();
        // Expecting shape: { StreamingChannel: [...] }
        if (data && Array.isArray(data.StreamingChannel)) return data.StreamingChannel as StreamingChannel[];
        // Some backends might return just the array
        if (Array.isArray(data)) return data as StreamingChannel[];
        return [];
    } catch (err) {
        if (DEMO_MODE) return MOCK_CHANNELS;
        throw (err instanceof Error ? err : new Error("Failed to load channels"));
    }
}

export async function downloadVideo(req: VideoDownloadRequest): Promise<Blob> {
    if (DEMO_MODE) {
        return fetchDemoVideoBlob();
    }
    try {
        const res = await apiFetch("/api/Videos/DownloadVideo", {
            method: "POST",
            body: JSON.stringify(req),
        });
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
            // Might be an error payload or a URL; surface message if possible
            const json = await res.json();
            if (json && json.url) {
                // Fetch the actual file from provided URL
                const fileRes = await fetch(buildUrl(json.url));
                return await fileRes.blob();
            }
            throw new Error(typeof json.message === "string" ? json.message : "Unexpected download response");
        }
        return await res.blob();
    } catch (err) {
        if (DEMO_MODE) return fetchDemoVideoBlob();
        throw (err instanceof Error ? err : new Error("Failed to download video"));
    }
}

async function fetchDemoVideoBlob(): Promise<Blob> {
    const res = await fetch("/1.mov");
    if (!res.ok) throw new Error("Demo video not found");
    return await res.blob();
}

// A compact set of demo channels mirroring expected fields
const MOCK_CHANNELS: StreamingChannel[] = [
    { id: "101", channelName: "101", Video: { videoCodecType: "H.265", videoResolutionWidth: "2560", videoResolutionHeight: "1440" } },
    { id: "102", channelName: "102", Video: { videoCodecType: "H.265", videoResolutionWidth: "640", videoResolutionHeight: "360" } },
    { id: "104", channelName: "104", Video: { videoCodecType: "H.264", videoResolutionWidth: "704", videoResolutionHeight: "576" } },
    { id: "201", channelName: "201", Video: { videoCodecType: "H.265", videoResolutionWidth: "2560", videoResolutionHeight: "1440" } },
    { id: "202", channelName: "202", Video: { videoCodecType: "H.265", videoResolutionWidth: "640", videoResolutionHeight: "360" } },
    { id: "204", channelName: "204", Video: { videoCodecType: "H.264", videoResolutionWidth: "704", videoResolutionHeight: "576" } },
];


