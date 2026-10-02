import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import type { FileEntry } from "../types/file";

export default function FilePractice() {
  const [path, setPath] = useState("C:\\Users\\User\\Desktop");

  const [keyword, setKeyword] = useState("");

  const [files, setFiles] = useState<FileEntry[]>([]);

  const handleListFiles = async () => {
    try {
      const result = await invoke<FileEntry[]>("list_files", { path });

      setFiles(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await invoke<FileEntry[]>("search_files", {
        path,
        keyword,
      });

      setFiles(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = async (filePath: string) => {
    try {
      await invoke("open_file", {
        path: filePath,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (file: FileEntry) => {
    if (file.is_directory) {
      alert("폴더는 삭제하지 않습니다.");
      return;
    }

    const confirmed = window.confirm(`${file.name} 파일을 정말 삭제할까요?`);

    if (!confirmed) return;

    try {
      await invoke("delete_file", {
        path: file.path,
      });

      setFiles((prev) => prev.filter((item) => item.path !== file.path));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="file-practice">
      <h1>파일 연습</h1>

      <div className="file-controls">
        <input value={path} onChange={(e) => setPath(e.target.value)} />

        <button onClick={handleListFiles}>폴더 읽기</button>
      </div>

      <div className="file-controls">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어"
        />

        <button onClick={handleSearch}>검색</button>
      </div>

      <div className="file-list">
        {files.map((file) => (
          <div className="file-item" key={file.path}>
            <div>
              {file.is_directory ? "📁" : "📄"} {file.name}
            </div>

            <div className="file-path">{file.path}</div>

            {!file.is_directory && (
              <div className="file-actions">
                <button onClick={() => handleOpen(file.path)}>열기</button>

                <button onClick={() => handleDelete(file)}>삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
