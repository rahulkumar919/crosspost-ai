import apiClient from "./client";

export interface UploadMediaResponse {
    mediaId: string;
    url: string;
    type: "video" | "image";
    thumbnailUrl?: string;
    durationSeconds?: number;
    width?: number;
    height?: number;
    bytes: number;
    format: string;
}

// Backend response shape from media.service.ts
interface BackendUploadResponse {
    mediaId: string;
    url: string;
    type: "VIDEO" | "IMAGE";
    thumbnailUrl?: string;
    durationSeconds?: number;
    width?: number;
    height?: number;
    bytes: number;
    format: string;
}

export async function uploadMedia(
    file: File,
    onProgress?: (pct: number) => void
): Promise<UploadMediaResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<BackendUploadResponse>("/media/upload", formData, {
        headers: {
            // Let the browser set the multipart boundary automatically
            "Content-Type": "multipart/form-data",
        },
        timeout: 300_000, // 5 min for large video uploads
        onUploadProgress: (event) => {
            if (event.total && onProgress) {
                const pct = Math.round((event.loaded * 100) / event.total);
                onProgress(pct);
            }
        },
    });

    return {
        ...res.data,
        type: res.data.type === "VIDEO" ? "video" : "image",
    };
}
