
export type TaskPageType = {
    items: Task[];
    totalCount: number;
    hasNextPage: boolean;
    limit: number;
    offset: number;
}

export type Task = { id: string; title: string; completed: boolean; createdAt: Date; updatedAt: Date; taskListId: string }