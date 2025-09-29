import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateAnalysisTitleApi } from '@/api/analysis'; // 제목 수정 API
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast'; // 성공/실패 알림용
import { CustomAlertDialog } from '@/components/common/CustomAlertDialog'; // 새로 추가

/**
 * QR 분석 결과 또는 이력 상세 정보를 표시하고 제목을 저장하는 패널입니다.
 * (Figma PDF 19페이지 참고)
 * * @param {object} result - analysisId, status, url, ipAddress, title 등의 분석 결과 객체
 */
export default function AnalysisResultPanel({ result }) {
    const [title, setTitle] = useState(result?.title || '');
    const [isLoading, setIsLoading] = useState(false);
    // const { toast } = useToast();
    const [alertDialogState, setAlertDialogState] = useState({
        isOpen: false,
        title: '',
        message: ''
    });

    // result 객체가 변경될 때마다 제목을 초기화 (이력 선택 시)
    useEffect(() => {
        setTitle(result?.title || '');
    }, [result]);

    // 결과 상태에 따라 표시할 색상, 아이콘, 텍스트를 결정
    const getStatusProps = (status) => {
        switch (status) {
            case '안전':
                return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, label: '안전' };
            case '주의':
                return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle, label: '주의' };
            case '위험':
                return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: '위험' };
            default:
                return { color: 'text-gray-500', bg: 'bg-gray-50', icon: Loader2, label: '알 수 없음' };
        }
    };

    const statusProps = getStatusProps(result?.status);
    const Icon = statusProps.icon;

    // 제목 저장 (Submit 버튼 클릭) 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !result?.id) {
            setAlertDialogState({
                isOpen: true,
                title: "오류",
                message: "제목과 분석 ID가 유효해야 합니다."
            });
            return;
        }

        setIsLoading(true);
        try {
            // API 호출: 제목 업데이트
            await updateAnalysisTitleApi(result.id, title);

            setAlertDialogState({
                isOpen: true,
                title: "저장 성공",
                message: "분석 기록 제목이 성공적으로 저장되었습니다."
            });
        } catch (error) {
            console.error('제목 저장 실패:', error);
            setAlertDialogState({
                isOpen: true,
                title: "저장 실패",
                message: error.message || "제목 저장 중 오류가 발생했습니다."
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!result) {
        return <div className="text-center text-gray-500">분석 결과나 이력 항목을 선택해 주세요.</div>;
    }

    return (
        <>
            <CardContent className="w-full h-full flex flex-col p-6 space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2 mb-4">QR Analysis Result</h2>

                {/* 상태 표시 섹션 */}
                <div className={`p-4 rounded-lg ${statusProps.bg} flex items-center space-x-3`}>
                    <Icon className={`h-6 w-6 ${statusProps.color}`} />
                    <span className={`text-lg font-semibold ${statusProps.color}`}>
                        상태: {statusProps.label}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* URL 표시 */}
                    <div className="grid gap-2">
                        <label htmlFor="url" className="text-sm font-semibold text-gray-700">URL</label>
                        <Input id="url" value={result.url} readOnly className="bg-gray-100 cursor-default" />
                    </div>

                    {/* 제목 입력 (사용자 설정) */}
                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-semibold text-gray-700">제목 (사용자 설정)</label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="기록을 저장할 제목을 입력하세요"
                            required
                        />
                    </div>

                    {/* IP Address 표시 */}
                    <div className="grid gap-2">
                        <label htmlFor="ipAddress" className="text-sm font-semibold text-gray-700">IP Address</label>
                        <Input id="ipAddress" value={result.ipAddress} readOnly className="bg-gray-100 cursor-default" />
                    </div>

                    {/* Submit 버튼 */}
                    <Button
                        type="submit"
                        className="w-full h-10 bg-green-500 hover:bg-green-600 font-bold shadow-md"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </form>
            </CardContent>
            {/* 알림 다이얼로그 컴포넌트 추가 */}
            <CustomAlertDialog
                isOpen={alertDialogState.isOpen}
                onClose={() => setAlertDialogState({ ...alertDialogState, isOpen: false })}
                title={alertDialogState.title}
                message={alertDialogState.message}
            />
        </>
    );
}