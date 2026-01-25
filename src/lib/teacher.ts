import api from "./api";
import {
    ChapterResponseDto,
    ChapterRequestDto,
    ChapterStructureResponseDto,
    ChapterStatisticsDto,
    TopicRequestDto,
    TopicResponseDto,
    LectureRequestDto,
    GooglePdfContentRequestDto,
    QuizRequestDto,
    QuizQuestionRequestDto,
    StudentChapterProgressDto,
} from "@/types";

// ==================== Teacher Chapter Management ====================

export const getAssignedChapters = () =>
    api.get<ChapterResponseDto[]>("/v1/teachers/assigned-chapters");

export const getChapterStatistics = (chapterId: number) =>
    api.get<ChapterStatisticsDto>(`/v1/teachers/chapters/${chapterId}/statistics`);

// Reuse chapter endpoints from admin
export { getChapterById, updateChapter, getChapterCoverImage, uploadChapterCoverImage, getChapterStructure } from "./admin";

// ==================== Topic Management ====================

export const createTopic = (data: TopicRequestDto) =>
    api.post<TopicResponseDto>("/v1/topics", data);

export const getTopicById = (id: number) =>
    api.get<TopicResponseDto>(`/v1/topics/${id}`);

export const updateTopic = (id: number, data: TopicRequestDto) =>
    api.put<TopicResponseDto>(`/v1/topics/${id}`, data);

export const deleteTopic = (id: number) =>
    api.delete(`/v1/topics/${id}`);

// ==================== Content Management ====================

export const createLecture = (data: LectureRequestDto) =>
    api.post("/v1/contents/lecture", data);

export const createPdf = (data: GooglePdfContentRequestDto) =>
    api.post("/v1/contents/pdf", data);

export const createQuiz = (data: QuizRequestDto) =>
    api.post("/v1/contents/quiz", data);

export const getContentById = (id: number) =>
    api.get(`/v1/contents/${id}`);

// Quiz update endpoints
export const updateQuiz = (id: number, data: QuizRequestDto) =>
    api.put(`/v1/contents/quiz/${id}`, data);

export const updateQuizQuestions = (id: number, questions: QuizQuestionRequestDto[]) =>
    api.put(`/v1/contents/quiz/${id}/questions`, questions);

export const updateQuizByContentItem = (contentItemId: number, data: QuizRequestDto) =>
    api.put(`/v1/contents/quiz/content-item/${contentItemId}`, data);

export const updateQuizQuestionsByContentItem = (contentItemId: number, questions: QuizQuestionRequestDto[]) =>
    api.put(`/v1/contents/quiz/content-item/${contentItemId}/questions`, questions);

// ==================== Student Progress ====================

export const getStudentsProgress = (chapterId: number) =>
    api.get<StudentChapterProgressDto[]>(`/v1/progress/admin/chapter/${chapterId}/students-progress`);
