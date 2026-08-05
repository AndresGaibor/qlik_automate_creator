declare module "ssh2-sftp-client" {
  import type { SFTPWrapper, ConnectOptions } from "ssh2";

  type FileInfoType = "d" | "-" | "l";

  interface FileInfo {
    type: FileInfoType;
    name: string;
    size: number;
    modifyTime: number;
    accessTime: number;
  }

  interface FileStats {
    type: FileInfoType;
    size: number;
    modifyTime: number;
    accessTime: number;
    mode: number;
    uid: number;
    gid: number;
  }

  type ListFilterFunction = (fileInfo: FileInfo) => boolean;

  interface TransferOptions {
    step?: number;
    chunkSize?: number;
    concurrency?: number;
  }

  interface FastGetTransferOptions {
    step?: number;
    chunkSize?: number;
    concurrency?: number;
  }

  interface FastPutTransferOptions {
    step?: number;
    chunkSize?: number;
    concurrency?: number;
  }

  interface GetTransferOptions {
    flags?: string;
    encoding?: string;
    mode?: number;
    start?: number;
    end?: number;
    step?: number;
    chunkSize?: number;
  }

  interface Callbacks {
    onOpen?: (callback: () => void) => void;
    onClose?: (callback: () => void) => void;
    onPacket?: () => void;
    onHandshake?: (callback: () => void) => void;
    onAuthMethods?: (methods: Record<string, unknown>) => void;
    onAuthKeyboardMethod?: (callback: (str: string) => void) => void;
    onError?: (err: Error) => void;
  }

  class sftp {
    constructor(name?: string, callbacks?: Callbacks);
    connect(options: ConnectOptions): Promise<SFTPWrapper>;
    list(remoteFilePath: string, filter?: ListFilterFunction): Promise<FileInfo[]>;
    exists(remotePath: string): Promise<false | FileInfoType>;
    stat(remotePath: string): Promise<FileStats>;
    realPath(remotePath: string): Promise<string>;
    get(
      path: string,
      dst?: string | NodeJS.WritableStream,
      options?: GetTransferOptions,
    ): Promise<string | NodeJS.WritableStream | Buffer>;
    fastGet(
      remoteFilePath: string,
      localPath: string,
      options?: FastGetTransferOptions,
    ): Promise<string>;
    put(
      input: string | Buffer | NodeJS.ReadableStream,
      remoteFilePath: string,
      options?: FastPutTransferOptions,
    ): Promise<string>;
    fastPut(
      localPath: string,
      remoteFilePath: string,
      options?: FastPutTransferOptions,
    ): Promise<string>;
    createReadStream(
      path: string,
      options?: { flags?: string; encoding?: string; mode?: number; autoClose?: boolean },
    ): NodeJS.ReadableStream;
    createWriteStream(
      path: string,
      options?: { flags?: string; encoding?: string; mode?: number; autoClose?: boolean },
    ): NodeJS.WritableStream;
    mkdir(remoteFilePath: string, createRecursive?: boolean): Promise<string>;
    rmdir(remoteFilePath: string, recursive?: boolean): Promise<string>;
    delete(remoteFilePath: string): Promise<string>;
    rename(
      remoteSourcePath: string,
      remoteDestPath: string,
      flags?: number,
    ): Promise<string>;
    chmod(remotePath: string, mode: number | string): Promise<string>;
    chown(remotePath: string, uid: number, gid: number): Promise<string>;
    cwd(): Promise<string>;
    end(): Promise<void>;
    posixFormatStat(stat: FileStats): string;
  }

  export = sftp;
}
