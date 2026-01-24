// Authentication types
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
    fullName: string;
    roles: string[];
}

export interface User {
    id?: number;
    email: string;
    fullName: string;
    phone?: string;
    roles: string[];
    hasProfilePicture?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Enums
export enum ChapterStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}

export enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT"
}

// Class types
export interface ClassRequestDto {
    name: string;
    description?: string;
}

export interface ClassResponseDto {
    id: number;
    name: string;
    description?: string;
}

export interface ClassStructureResponseDto {
    id: number;
    name: string;
    description?: string;
    subjects: SubjectStructureResponseDto[];
}

// Subject types
export interface SubjectRequestDto {
    classId: number;
    name: string;
    description?: string;
    orderIndex?: number;
}

export interface SubjectResponseDto {
    id: number;
    name: string;
    description?: string;
    orderIndex?: number;
    classId: number;
    className?: string;
}

export interface SubjectStructureResponseDto {
    id: number;
    name: string;
    orderIndex?: number;
    chapters: ChapterStructureResponseDto[];
}

// Chapter types
export interface ChapterRequestDto {
    subjectId: number;
    title: string;
    description?: string;
    status?: ChapterStatus;
    orderIndex?: number;
    videoId?: string;
    price?: number;
    free?: boolean;
}

export interface ChapterResponseDto {
    id: number;
    title: string;
    description?: string;
    status: ChapterStatus;
    orderIndex?: number;
    subjectId: number;
    subjectName?: string;
    videoId?: string;
    price?: number;
    free?: boolean;
    teachers?: TeacherDto[];
}

export interface ChapterStructureResponseDto {
    id: number;
    title: string;
    status: ChapterStatus;
    orderIndex?: number;
    topics: TopicStructureResponseDto[];
}

export interface TopicStructureResponseDto {
    id: number;
    title: string;
    orderIndex?: number;
    contentItems: ContentItemStructureResponseDto[];
}

export interface ContentItemStructureResponseDto {
    id: number;
    title: string;
    type: ContentItemType;
    orderIndex?: number;
}

export enum ContentItemType {
    LECTURE = "LECTURE",
    QUIZ = "QUIZ",
    PDF = "PDF",
    ASSIGNMENT = "ASSIGNMENT"
}

// Teacher types
export interface TeacherDto {
    id: number;
    fullName: string;
    email: string;
}

// Payment types
export interface PaymentRequestDto {
    chapterId: number;
    transactionId?: string;
    senderNumber?: string;
    amount?: number;
    paymentMethod?: string;
}

export interface PaymentResponseDto {
    id: number;
    userId: number;
    userName?: string;
    chapterId: number;
    chapterTitle?: string;
    senderNumber?: string;
    transactionId?: string;
    amount?: number;
    paymentMethod?: string;
    status: PaymentStatus;
    verifiedAt?: string;
    verifiedByUserId?: number;
    verifiedByName?: string;
}

// Admin Statistics types
export interface AdminStatisticsDto {
    userStats: UserStats;
    courseStats: CourseStats;
    chapterStats: ChapterStats;
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    admins: number;
    managers: number;
    teachers: number;
    students: number;
}

export interface CourseStats {
    totalClasses: number;
    totalSubjects: number;
    totalChapters: number;
}

export interface ChapterStats {
    totalDraft: number;
    totalPublished: number;
    totalFree: number;
}

// Form state types
export interface ClassFormState {
    name: string;
    description: string;
}

export interface SubjectFormState {
    classId: number;
    name: string;
    description: string;
    orderIndex: number;
}

export interface ChapterFormState {
    subjectId: number;
    title: string;
    description: string;
    status: ChapterStatus;
    orderIndex: number;
    videoId: string;
    price: number;
    free: boolean;
}
