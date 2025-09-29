import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    
    // ★★★ 이 부분을 추가해야 합니다. ★★★
    server: {
        host: true, // 모든 네트워크 인터페이스(IP 주소)에서의 접속을 허용
        port: 5173, // 포트 번호가 5173으로 유지되도록 명시
    },
    // ★★★★★★★★★★★★★★★★★★★★★★★
})