//로그인 결과 팝업
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const SignupResultDialog = ({ isOpen, type, onAction, onClose }) => {
  const isSuccess = type === 'success';

  // Figma PDF 6페이지 (성공) 및 7페이지 (실패) 디자인을 반영한 설정
  const config = isSuccess ? {
    icon: CheckCircle,
    title: 'Sign Up Successful!',
    message: 'Welcome to QREX! Your account has been created successfully.',
    feature: 'New Feature Added: When you use the QR phishing detection feature, your activity will be recorded and can be shared with the community. Try QREX\'s services!',
    buttonText: 'Home',
    buttonClass: 'bg-green-500 hover:bg-green-600',
  } : {
    icon: XCircle,
    title: 'Sign Up Failed',
    message: 'Something went wrong. Please check your information and try again.',
    feature: 'Why Join QREX? By joining QREX, you can detect QR phishing safely and share your insights with the community.',
    buttonText: 'Try Again',
    buttonClass: 'bg-green-500 hover:bg-green-600', 
  };

  const IconComponent = config.icon;

  const handleAction = () => {
    onAction(isSuccess); // 성공/실패 여부를 부모 컴포넌트에 전달 (Home 또는 Try Again 로직 실행)
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-sm rounded-lg shadow-xl p-6">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            {/* 아이콘: 성공(초록색 체크) 또는 실패(빨간색 X) */}
            <IconComponent className={`h-6 w-6 ${isSuccess ? 'text-green-500' : 'text-red-500'}`} />
            <DialogTitle className="text-xl font-bold">{config.title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            {config.message}
          </DialogDescription>
        </DialogHeader>

        {/* 추가 기능/가이드 섹션 (Figma 디자인 요소) */}
        <div className="mt-4 p-4 border rounded-md bg-gray-50 space-y-2">
            <div className="flex items-start space-x-2">
                 {/* 초록색 아이콘 유지 */}
                 <CheckCircle className="h-4 w-4 text-green-500 mt-1" /> 
                 <p className="text-sm font-semibold">{isSuccess ? 'New Feature Added' : 'Why Join QREX?'}</p>
            </div>
            <p className="text-xs text-gray-700">{config.feature}</p>
        </div>
        
        {/* 버튼: Home 또는 Try Again */}
        <Button 
          onClick={handleAction} 
          className={`w-full h-10 mt-4 ${config.buttonClass} text-white font-bold`}
        >
          {config.buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SignupResultDialog;
