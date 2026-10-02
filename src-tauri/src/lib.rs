use std::{
    fs,
    path::Path,
};

use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager,
};

use tauri_plugin_opener::OpenerExt;

#[derive(serde::Serialize)]
struct FileEntry {
    name: String,
    path: String,
    is_directory: bool,
}

#[tauri::command]
fn file_exists(path: String) -> bool {
    Path::new(&path).exists()
}

#[tauri::command]
fn list_files(path: String) -> Result<Vec<FileEntry>, String> {
    let entries = fs::read_dir(&path)
        .map_err(|e| e.to_string())?;

    let mut result = Vec::new();

    for entry in entries {
        let entry = entry
            .map_err(|e| e.to_string())?;

        let path = entry.path();

        let name = entry
            .file_name()
            .to_string_lossy()
            .to_string();

        result.push(FileEntry {
            name,
            path: path.to_string_lossy().to_string(),
            is_directory: path.is_dir(),
        });
    }

    Ok(result)
}

#[tauri::command]
fn search_files(
    path: String,
    keyword: String,
) -> Result<Vec<FileEntry>, String> {
    let entries = fs::read_dir(&path)
        .map_err(|e| e.to_string())?;

    let keyword = keyword.to_lowercase();

    let mut result = Vec::new();

    for entry in entries {
        let entry = entry
            .map_err(|e| e.to_string())?;

        let path = entry.path();

        let name = entry
            .file_name()
            .to_string_lossy()
            .to_string();

        if name.to_lowercase().contains(&keyword) {
            result.push(FileEntry {
                name,
                path: path.to_string_lossy().to_string(),
                is_directory: path.is_dir(),
            });
        }
    }

    Ok(result)
}

#[tauri::command]
fn open_file(
    app: tauri::AppHandle,
    path: String,
) -> Result<(), String> {
    app.opener()
        .open_path(path, None::<&str>)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_file(path: String) -> Result<(), String> {
    let path = Path::new(&path);

    if !path.exists() {
        return Err("파일이 존재하지 않습니다.".to_string());
    }

    if path.is_dir() {
        return Err("폴더는 이 기능으로 삭제할 수 없습니다.".to_string());
    }

    fs::remove_file(path)
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())

        .invoke_handler(
            tauri::generate_handler![
                file_exists,
                list_files,
                search_files,
                open_file,
                delete_file
            ]
        )

        .setup(|app| {
            let open = MenuItem::with_id(
                app,
                "open",
                "앱 열기",
                true,
                None::<&str>,
            )?;

            let hide = MenuItem::with_id(
                app,
                "hide",
                "창 숨기기",
                true,
                None::<&str>,
            )?;

            let quit = MenuItem::with_id(
                app,
                "quit",
                "종료",
                true,
                None::<&str>,
            )?;

            let menu = Menu::with_items(
                app,
                &[&open, &hide, &quit],
            )?;

            TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "open" => {
                            if let Some(window) =
                                app.get_webview_window("tauri-practice")
                            {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }

                        "hide" => {
                            if let Some(window) =
                                app.get_webview_window("tauri-practice")
                            {
                                let _ = window.hide();
                            }
                        }

                        "quit" => {
                            app.exit(0);
                        }

                        _ => {}
                    }
                })
                .build(app)?;

            Ok(())
        })

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}