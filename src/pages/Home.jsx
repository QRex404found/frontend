import { Card, CardContent } from '@/components/ui/card';
import { Player } from '@lottiefiles/react-lottie-player';
import mascotAnimation from '@/assets/mascot_basic_lottie.json';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center">
      <Card className="max-w-xl w-full p-8 shadow-lg">
        <CardContent className="flex flex-col items-center space-y-6 p-0">

          <div className="w-64 h-64 bg-red-300">
            <Player
              autoplay
              loop
              src={mascotAnimation}
              style={{ width: '100%', height: '100%', border: '2px solid blue' }}
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
