// --- AnalysisResultPanel.jsx ---

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateAnalysisTitleApi } from '@/api/analysis';
import { ShieldCheck, ShieldBan, ShieldAlert, Loader2, ScanQrCode} from 'lucide-react';
import { toast } from "sonner";

export default function AnalysisResultPanel({ result, onTitleUpdated, onReset }) {

    const [title, setTitle] = useState(result?.analysisTitle || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailView, setIsDetailView] = useState(false);

    useEffect(() => {
        setTitle(result?.analysisTitle || '');
        setIsDetailView(false);
    }, [result]);


    /* ------------------------------------------------
       Submit → 제목 저장 및 상위 컴포넌트에 전달
    --------------------------------------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !result?.analysisId) {
            toast.warning("제목은 공백일 수 없습니다.");
            return;
        }

        setIsLoading(true);

        try {
            await updateAnalysisTitleApi(result.analysisId, title.trim());

            if (onTitleUpdated) {
                onTitleUpdated(result.analysisId, title.trim());
            }

            toast.success("분석 기록 제목이 성공적으로 저장되었습니다.");

        } catch (error) {
            toast.error(error.message || "제목 저장 중 오류가 발생했습니다.");

        } finally {
            setIsLoading(false);
        }
    };


    const getStatusProps = (riskLevel) => {
        switch (riskLevel) {
            case 'SAFE':
                return { color: 'text-green-600', bg: 'bg-green-50', icon: ShieldCheck, label: '안전' };
            case 'WARNING':
                return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: ShieldAlert, label: '주의' };
            case 'DANGER':
                return { color: 'text-red-600', bg: 'bg-red-50', icon: ShieldBan, label: '위험' };
            default:
                return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: ShieldAlert, label: '주의' };
        }
    };

    const statusProps = getStatusProps(result?.riskLevel);
    const Icon = statusProps.icon;


    if (!result) {
        return (
            <div className="text-center text-gray-500">
                분석 결과나 이력 항목을 선택해 주세요.
            </div>
        );
    }


    return (
        <div className="w-full h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="!text-3xl font-light">QR Analysis Result</h2>

                <button
                    onClick={onReset}
                    className="
                        p-2 rounded-full
                        text-gray-500 hover:text-gray-700
                        hover:bg-gray-100
                        transition-colors
                    "
                    title="New Analysis"
                >
                    <ScanQrCode className="w-5 h-5" />
                </button>
            </div>


            {/* ---------- 요약 ---------- */}
            {!isDetailView && (
                <div className="space-y-6">

                    <div className={`p-4 rounded-lg ${statusProps.bg} flex items-center space-x-3`}>
                        <Icon className={`h-6 w-6 ${statusProps.color}`} />
                        <span className={`text-lg font-semibold ${statusProps.color}`}>
                            상태: {statusProps.label}
                        </span>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-semibold text-gray-700">URL</label>
                        <Input
                            value={result.url}
                            readOnly
                            className="bg-gray-100 cursor-default"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-semibold text-gray-700">IP Address</label>
                        <Input
                            value={result.ipAddress}
                            readOnly
                            className="bg-gray-100 cursor-default"
                        />
                    </div>

                </div>
            )}


            {/* ---------- 상세 보기 ---------- */}
            {isDetailView && (
                <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700">상세 분석 결과</label>
                    <div className="p-4 bg-gray-100 rounded-md min-h-[260px] text-gray-800 whitespace-pre-wrap overflow-y-auto">
                        {result.reason || "상세 분석 내용이 없습니다."}
                    </div>
                </div>
            )}


            {/* ---------- 제목 수정 ---------- */}
            {!isDetailView && (
                <form onSubmit={handleSubmit} className="space-y-2">

                    <label className="text-sm font-semibold text-gray-700">
                        제목 (사용자 설정)
                    </label>

                    <div className="flex items-end gap-2">

                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="기록을 저장할 제목을 입력하세요"
                            required
                            className="flex-grow"
                        />

                        <Button
                            type="submit"
                            className="w-auto h-10 bg-lime-500 hover:bg-lime-600 text-white font-bold shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : "Submit"}
                        </Button>

                    </div>

                </form>
            )}


            <Button
                type="button"
                className={`
                    w-full h-10 font-bold shadow-md
                    ${isDetailView 
                        ? "bg-[#999999] hover:bg-[#808080] text-white"
                        : "bg-lime-500 hover:bg-lime-600 text-white"
                    }
                `}
                onClick={() => setIsDetailView(!isDetailView)}
            >
                {isDetailView ? "Back" : "Detail"}
            </Button>

        </div>
    );
}
