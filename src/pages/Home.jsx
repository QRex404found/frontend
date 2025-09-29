// 메인 페이지
import { Card, CardContent } from '@/components/ui/card';
// --- [수정] ---
// 경로 별칭(@) 대신, 현재 파일을 기준으로 한 상대 경로를 사용합니다.
// ../는 현재 폴더(pages)에서 상위 폴더(src)로 나가는 것을 의미합니다.
import mascotImage from '@/assets/mascot.png';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center">
      <Card className="max-w-xl w-full p-8 shadow-lg">
        <CardContent className="flex flex-col items-center space-y-6 p-0">
          
          <div>
            <img 
              src={mascotImage} 
              alt="QREX Mascot" 
              className="w-64 h-64 object-cover"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mt-4">QREX</h1>
          <p className="text-xl text-gray-600">
            QR 피싱으로부터 당신을 보호하고, 커뮤니티와 함께 안전을 지켜나가세요!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

