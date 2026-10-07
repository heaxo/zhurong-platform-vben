import type { JobBrowserTreeNode } from '@zhurong/api';

export type JobSelectMode = 'create' | 'existing';

export interface JobSelectTreeNode extends JobBrowserTreeNode {
  children?: JobSelectTreeNode[];
  key: string;
  path: string;
  title: string;
}

export interface JobSelectResult {
  jobName: string;
  jobPath?: string;
  jobRef?: string;
  mode: JobSelectMode;
  node?: JobSelectTreeNode;
}

export interface JobSelectOpenOptions {
  jobRefs?: Array<null | string | undefined>;
}

export interface JobSelectModalExpose {
  close: () => Promise<void> | void;
  open: (options?: JobSelectOpenOptions) => void;
}

export type CreateJobFn = (
  jobName: string,
  jobPath: string,
) => Promise<string> | string;
