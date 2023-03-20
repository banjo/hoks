declare module "staged-git-files" {
    export default function stagedGitFiles(): Promise<{ filename: string; status: string }[]>;
}
