import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Platform } from "@/types/account.types";
import type {
    DraftPost,
    MediaFile,
    PlatformDraft,
    CreateStep,
    PublishJob,
} from "@/types/post.types";

import type { AIContentAnalysis, PlatformContent } from "@/types/ai.types";

const defaultPlatformDraft = (platform: Platform): PlatformDraft => ({
    platform,
    title: "",
    description: "",
    hashtags: [],
    isIncluded: true,
});

const initialDraft: DraftPost = {
    mediaFile: null,
    rawCaption: "",
    generatedTitle: "",
    generatedDescription: "",
    generatedHashtags: [],
    platformDrafts: {
        youtube: defaultPlatformDraft("youtube"),
        instagram: defaultPlatformDraft("instagram"),
        linkedin: defaultPlatformDraft("linkedin"),
    },
};

interface DraftPostState {
    draft: DraftPost;
    currentStep: CreateStep;
    publishJob: PublishJob | null;

    // Media
    setMediaFile: (file: MediaFile | null) => void;
    setRawCaption: (caption: string) => void;

    // AI content
    setGeneratedContent: (
        title: string,
        description: string,
        hashtags: string[],
        platforms?: {
            youtube?: PlatformContent;
            instagram?: PlatformContent;
            linkedin?: PlatformContent;
        },
        analysis?: AIContentAnalysis
    ) => void;

    // Per-platform draft editing
    setPlatformDraft: (platform: Platform, updates: Partial<PlatformDraft>) => void;
    togglePlatformIncluded: (platform: Platform) => void;

    // Step navigation
    setStep: (step: CreateStep) => void;

    // Publish
    setPublishJob: (job: PublishJob | null) => void;
    updatePublishJobResult: (jobId: string, updatedJob: PublishJob) => void;

    // Reset
    resetDraft: () => void;
}

export const useDraftPostStore = create<DraftPostState>()(
    persist(
        (set) => ({
            draft: initialDraft,
            currentStep: "upload",
            publishJob: null,

            setMediaFile: (file) =>
                set((state) => ({ draft: { ...state.draft, mediaFile: file } })),

            setRawCaption: (rawCaption) =>
                set((state) => ({ draft: { ...state.draft, rawCaption } })),

            setGeneratedContent: (title, description, hashtags, platforms, analysis) =>
                set((state) => {
                    const yt = platforms?.youtube;
                    const ig = platforms?.instagram;
                    const li = platforms?.linkedin;

                    return {
                        draft: {
                            ...state.draft,
                            generatedTitle: title,
                            generatedDescription: description,
                            generatedHashtags: hashtags,
                            analysis: analysis || state.draft.analysis,
                            platformDrafts: {
                                youtube: {
                                    ...state.draft.platformDrafts.youtube,
                                    title: yt?.title || title,
                                    description: yt?.description || description,
                                    hashtags: yt?.hashtags || hashtags,
                                },
                                instagram: {
                                    ...state.draft.platformDrafts.instagram,
                                    title: ig?.title || title,
                                    description: ig?.description || description,
                                    hashtags: ig?.hashtags || hashtags,
                                },
                                linkedin: {
                                    ...state.draft.platformDrafts.linkedin,
                                    title: li?.title || title,
                                    description: li?.description || description,
                                    hashtags: li?.hashtags || hashtags,
                                },
                            },
                        },
                    };
                }),

            setPlatformDraft: (platform, updates) =>
                set((state) => ({
                    draft: {
                        ...state.draft,
                        platformDrafts: {
                            ...state.draft.platformDrafts,
                            [platform]: { ...state.draft.platformDrafts[platform], ...updates },
                        },
                    },
                })),

            togglePlatformIncluded: (platform) =>
                set((state) => ({
                    draft: {
                        ...state.draft,
                        platformDrafts: {
                            ...state.draft.platformDrafts,
                            [platform]: {
                                ...state.draft.platformDrafts[platform],
                                isIncluded: !state.draft.platformDrafts[platform].isIncluded,
                            },
                        },
                    },
                })),

            setStep: (currentStep) => set({ currentStep }),

            setPublishJob: (publishJob) => set({ publishJob }),

            updatePublishJobResult: (_jobId, updatedJob) => set({ publishJob: updatedJob }),

            resetDraft: () =>
                set({ draft: initialDraft, currentStep: "upload", publishJob: null }),
        }),
        {
            name: "crosspost_draft_store",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                currentStep: state.currentStep,
                draft: {
                    ...state.draft,
                    mediaFile: state.draft.mediaFile
                        ? {
                            file: new File([], state.draft.mediaFile.file?.name || "media", {
                                type: state.draft.mediaFile.type === "video" ? "video/mp4" : "image/jpeg",
                            }),
                            previewUrl: state.draft.mediaFile.previewUrl,
                            type: state.draft.mediaFile.type,
                            durationSeconds: state.draft.mediaFile.durationSeconds,
                            originalSize: state.draft.mediaFile.originalSize,
                            optimizedSize: state.draft.mediaFile.optimizedSize,
                            width: state.draft.mediaFile.width,
                            height: state.draft.mediaFile.height,
                            aspectRatio: state.draft.mediaFile.aspectRatio,
                        }
                        : null,
                },
            }),
        }
    )
);
