// 로그인 결과 팝업
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const SignupResultDialog = ({ isOpen, type, onAction, onClose }) => {
  const isSuccess = type === 'success';

  const config = isSuccess ? {
    icon: CheckCircle,
    title: 'Sign Up Successful!',
    message: 'Welcome to QREX! Your account has been created successfully.',
    feature: 'New Feature Added: When you use the QR phishing detection feature, your activity will be recorded and can be shared with the community. Try QREX\'s services!',
    buttonText: 'Go to Login',
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
    onAction(isSuccess ? 'success' : 'failure');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-sm rounded-lg shadow-xl p-6">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <IconComponent className={`h-6 w-6 ${isSuccess ? 'text-green-500' : 'text-red-500'}`} />
            <DialogTitle className="text-xl font-bold">{config.title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            {config.message}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 mt-4 space-y-2 border rounded-md bg-gray-50">
            <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" /> 
                <p className="text-sm font-semibold">{isSuccess ? 'New Feature Added' : 'Why Join QREX?'}</p>
            </div>
            <p className="text-xs text-gray-700">{config.feature}</p>
        </div>

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
