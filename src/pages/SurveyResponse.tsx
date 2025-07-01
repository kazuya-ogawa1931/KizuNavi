import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { useLocation } from "react-router-dom"; // TODO: Use when location is needed
import { useAuth } from "../context/AuthContext";
import { useQuestions } from "../context/QuestionsContext";
import type { Answer, Survey } from "../types";
import { THEME_COLORS } from "../types";

const SurveyResponsePage: React.FC = () => {
  const { token } = useParams<{ token?: string }>();
  // const location = useLocation(); // TODO: Use location when needed
  const { user, logout } = useAuth();
  const { questions } = useQuestions();

  const [survey, setSurvey] = useState<Survey | null>(null);

  const QUESTIONS_PER_PAGE = 10;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");
  const [showAnnotations, setShowAnnotations] = useState(false);

  const ratingLabels = [
    "該当しない",
    "全く思わない",
    "あまり思わない",
    "どちらでもない",
    "そう思う",
    "強くそう思う",
    "非常に強くそう思う",
  ];

  // Get annotation number for a question based on all questions with notes
  const getAnnotationNumber = (questionId: string) => {
    const questionsWithNotes = questions
      .filter((q) => q.note)
      .sort((a, b) => a.order - b.order);
    const index = questionsWithNotes.findIndex((q) => q.id === questionId);
    return index !== -1 ? index + 1 : null;
  };

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Mock survey loading - simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        let surveyData: Survey;

        if (token) {
          // Mock: Access via email link token
          surveyData = {
            id: "survey-1",
            title: "エンゲージメントサーベイ",
            companyId: "mock-company-1",
            deadline: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "published",
            targetEmployeeCount: 100,
            implementationDate: new Date().toISOString(),
            questions: questions,
            createdAt: new Date().toISOString(),
          };
        } else if (user?.companyId) {
          // Mock: Access via authenticated user - get latest survey
          const mockSurveys = [
            {
              id: "survey-1",
              title: "エンゲージメントサーベイ",
              companyId: user.companyId,
              deadline: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              status: "published" as const,
              targetEmployeeCount: 100,
              implementationDate: new Date().toISOString(),
              questions: questions,
              createdAt: new Date().toISOString(),
            },
          ];

          const activeSurvey = mockSurveys.find(
            (s) => s.status === "published"
          );
          if (!activeSurvey) {
            throw new Error("アクティブなサーベイが見つかりません");
          }
          surveyData = activeSurvey;
        } else {
          throw new Error("サーベイにアクセスできません");
        }

        setSurvey(surveyData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "サーベイの読み込みに失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSurvey();
  }, [token, user?.companyId, questions]);

  useEffect(() => {
    // Initialize answers array with empty state
    if (questions.length > 0) {
      setAnswers(
        questions.map((question) => ({
          questionId: question.id,
          value: question.type === "text" ? "" : -1, // -1 means no selection for rating
        }))
      );
    }
  }, [questions]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId ? { ...answer, value: rating } : answer
      )
    );
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId ? { ...answer, value: text } : answer
      )
    );
  };

  const getCurrentAnswer = (questionId: string): number | string => {
    const answer = answers.find((a) => a.questionId === questionId);
    const question = questions.find((q) => q.id === questionId);
    if (question?.type === "text") {
      return answer ? answer.value : "";
    }
    return answer ? answer.value : -1; // -1 means no selection
  };

  const getCurrentPageQuestions = () => {
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return questions.slice(startIndex, endIndex);
  };

  const canProceed = () => {
    const currentQuestions = getCurrentPageQuestions();
    return currentQuestions.every((question) => {
      const answer = getCurrentAnswer(question.id);
      if (question.type === "rating") {
        return Number(answer) >= 0; // 0 is valid answer (該当しない)
      } else {
        return String(answer).trim() !== "";
      }
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = answers.filter((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question?.type === "rating") {
        return Number(answer.value) === -1; // -1 means no selection
      } else {
        return String(answer.value).trim() === "";
      }
    });

    if (unansweredQuestions.length > 0) {
      setError("すべての質問に回答してください。");
      return;
    }

    if (!survey) {
      setError("サーベイ情報が見つかりません。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Filter out unselected answers and convert to proper format
      const validAnswers = answers.filter((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        if (question?.type === "rating") {
          return Number(answer.value) >= 0; // 0 is valid (該当しない)
        } else {
          return String(answer.value).trim() !== "";
        }
      });

      // Mock submission - simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (token) {
        // Mock: Submit via token (email link access)
        console.log("Mock: Survey submitted via token", {
          token,
          answers: validAnswers,
        });
      } else if (user?.id) {
        // Mock: Submit via authenticated user
        console.log("Mock: Survey submitted via authenticated user", {
          surveyId: survey.id,
          userId: user.id,
          answers: validAnswers,
        });
      } else {
        throw new Error("認証情報が見つかりません");
      }

      setIsCompleted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "回答の送信に失敗しました。もう一度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading && !survey) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: `${THEME_COLORS.main}10` }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">サーベイを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !survey) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: `${THEME_COLORS.main}10` }}
      >
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">
            サーベイの読み込みに失敗しました
          </p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        style={{ backgroundColor: `${THEME_COLORS.main}10` }}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logout Button for completed screen */}
          <div className="flex justify-end mb-4">
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              ログアウト
            </button>
          </div>

          <div
            className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center"
            style={{ borderColor: THEME_COLORS.border, borderWidth: "1px" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${THEME_COLORS.status.success}20` }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: THEME_COLORS.status.success }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">回答完了</h2>
            <p className="text-gray-600 mb-6">
              エンゲージメントサーベイへのご回答ありがとうございました。
              <br />
              皆様の貴重なご意見をもとに、より良い職場環境づくりに取り組んでまいります。
            </p>
            <p className="text-sm text-gray-500">
              回答結果は匿名で処理され、分析結果は後日共有いたします。
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestions = getCurrentPageQuestions();
  const progress = (currentPage / totalPages) * 100;

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: `${THEME_COLORS.main}10` }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        {/* Header with Logout */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: THEME_COLORS.main }}
              >
                <span className="text-xl font-bold text-white">K</span>
              </div>
              <h1
                className="text-3xl font-bold"
                style={{ color: THEME_COLORS.accent }}
              >
                KizuNavi
              </h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              エンゲージメントサーベイ
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              ページ {currentPage} / {totalPages} （質問{" "}
              {(currentPage - 1) * QUESTIONS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * QUESTIONS_PER_PAGE, questions.length)} /{" "}
              {questions.length}）
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            ログアウト
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: THEME_COLORS.accent,
              }}
            />
          </div>
        </div>

        {/* Annotations Button - Always visible */}
        <div className="fixed top-20 right-4 z-30">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="bg-white text-gray-700 text-sm font-medium py-2 px-4 rounded-lg shadow-lg border transition-colors duration-200 hover:bg-gray-50"
            style={{ borderColor: THEME_COLORS.border }}
          >
            注釈 {showAnnotations ? "▼" : "▶"}
          </button>
        </div>

        {/* Annotations Panel */}
        {showAnnotations && (
          <>
            {/* Overlay to close annotations when clicking outside */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowAnnotations(false)}
            />
            <div
              className="fixed top-32 right-4 w-80 bg-white rounded-lg shadow-lg border p-4 z-20 max-h-96 overflow-y-auto"
              style={{ borderColor: THEME_COLORS.border }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">注釈一覧</h3>
                <button
                  onClick={() => setShowAnnotations(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {questions
                  .filter((q) => q.note)
                  .sort((a, b) => a.order - b.order)
                  .map((question, index) => (
                    <div key={question.id} className="text-sm">
                      <div
                        className="font-medium"
                        style={{ color: THEME_COLORS.status.error }}
                      >
                        ※{index + 1}
                      </div>
                      <div className="text-gray-600">{question.note}</div>
                    </div>
                  ))}
                {questions.filter((q) => q.note).length === 0 && (
                  <div className="text-sm text-gray-500">注釈はありません</div>
                )}
              </div>
            </div>
          </>
        )}

        <div
          className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10"
          style={{ borderColor: THEME_COLORS.border, borderWidth: "1px" }}
        >
          <div className="space-y-8">
            {currentQuestions.map((question, index) => {
              const annotationNumber = getAnnotationNumber(question.id);
              return (
                <div
                  key={question.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {(currentPage - 1) * QUESTIONS_PER_PAGE + index + 1}
                          {annotationNumber && (
                            <span
                              className="ml-1 text-sm"
                              style={{ color: THEME_COLORS.status.error }}
                            >
                              ※{annotationNumber}
                            </span>
                          )}
                          . {question.text}
                        </h3>
                      </div>
                    </div>

                    {question.type === "rating" ? (
                      <div className="space-y-3">
                        {[0, 1, 2, 3, 4, 5, 6].map((rating) => (
                          <label
                            key={rating}
                            className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors duration-200 ${
                              getCurrentAnswer(question.id) === rating
                                ? "shadow-sm"
                                : "hover:bg-gray-50"
                            }`}
                            style={{
                              borderColor:
                                getCurrentAnswer(question.id) === rating
                                  ? THEME_COLORS.accent
                                  : THEME_COLORS.border,
                              backgroundColor:
                                getCurrentAnswer(question.id) === rating
                                  ? `${THEME_COLORS.accent}10`
                                  : "transparent",
                            }}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={rating}
                              checked={getCurrentAnswer(question.id) === rating}
                              onChange={() =>
                                handleRatingChange(question.id, rating)
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center`}
                              style={{
                                borderColor:
                                  getCurrentAnswer(question.id) === rating
                                    ? THEME_COLORS.accent
                                    : THEME_COLORS.border,
                                backgroundColor:
                                  getCurrentAnswer(question.id) === rating
                                    ? THEME_COLORS.accent
                                    : "transparent",
                              }}
                            >
                              {getCurrentAnswer(question.id) === rating && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="flex-1 text-sm text-gray-700">
                              {rating}. {ratingLabels[rating]}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <textarea
                          value={String(getCurrentAnswer(question.id))}
                          onChange={(e) =>
                            handleTextChange(question.id, e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{ borderColor: THEME_COLORS.border }}
                          rows={4}
                          placeholder="ご意見・ご要望をお聞かせください..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div
              className="mt-6 p-4 rounded-md"
              style={{
                backgroundColor: `${THEME_COLORS.status.error}20`,
                borderColor: THEME_COLORS.status.error,
                borderWidth: "1px",
              }}
            >
              <div
                className="text-sm"
                style={{ color: THEME_COLORS.status.error }}
              >
                {error}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              前のページ
            </button>

            {currentPage === totalPages ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: THEME_COLORS.accent }}
              >
                {isLoading ? "送信中..." : "回答を送信"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: THEME_COLORS.accent }}
              >
                次のページ
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>※ 回答は匿名で処理され、個人を特定することはありません</p>
          <p>※ すべての質問への回答をお願いいたします</p>
        </div>
      </div>
    </div>
  );
};

export default SurveyResponsePage;
