export type BlockType =
  | "heading"
  | "paragraph"
  | "task"
  | "meeting"
  | "reminder";

export interface BaseBlock {
  id: string;
  type: BlockType;
  isDeleted?: boolean;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  content: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  content: string;
}

export interface TaskBlock extends BaseBlock {
  type: "task";
  content: string;
  isCompleted: boolean;
}

export interface MeetingBlock extends BaseBlock {
  type: "meeting";
  title: string;
  meetingUrl: string;
  date: string;
}

export interface ReminderBlock extends BaseBlock {
  type: "reminder";
  content: string;
  date: string;
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | TaskBlock
  | MeetingBlock
  | ReminderBlock;
