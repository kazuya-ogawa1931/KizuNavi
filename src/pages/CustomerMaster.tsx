import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext"; // TODO: Use when authentication is needed
import type { Company } from "../types";
import { THEME_COLORS } from "../types";
import CompanyService, {
  type CompanyRegistrationData,
} from "../utils/companyService";

const CustomerMaster: React.FC = () => {
  // const { user } = useAuth(); // TODO: Use user context when needed
  const [companyData, setCompanyData] = useState<Partial<Company>>({
    name: "",
    nameKana: "",
    address: "",
    postalCode: "",
    industry: "",
    phoneNumber: "",
    email: "",
    contractModel: "",
    contractDate: "",
    paymentCycle: "",
    salesPersonIds: [""],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalesPersonChange = (index: number, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      salesPersonIds:
        prev.salesPersonIds?.map((id, i) => (i === index ? value : id)) || [],
    }));
  };

  // TODO: Implement add sales person functionality
  // const addSalesPerson = () => {
  //   if ((companyData.salesPersonIds?.length || 0) < 4) {
  //     setCompanyData((prev) => ({
  //       ...prev,
  //       salesPersonIds: [...(prev.salesPersonIds || []), ""],
  //     }));
  //   }
  // };

  // TODO: Implement remove sales person functionality
  // const removeSalesPerson = (index: number) => {
  //   if ((companyData.salesPersonIds?.length || 0) > 1) {
  //     setCompanyData((prev) => ({
  //       ...prev,
  //       salesPersonIds:
  //         prev.salesPersonIds?.filter((_, i) => i !== index) || [],
  //     }));
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!companyData.name || !companyData.nameKana || !companyData.email) {
        throw new Error("必須項目を入力してください");
      }

      // Prepare company registration data
      const registrationData: CompanyRegistrationData = {
        name: companyData.name,
        nameKana: companyData.nameKana,
        address: companyData.address || "",
        postalCode: companyData.postalCode || "",
        industry: companyData.industry || "",
        phoneNumber: companyData.phoneNumber || "",
        email: companyData.email,
        contractModel: companyData.contractModel || "",
        contractDate: companyData.contractDate || "",
        paymentCycle: companyData.paymentCycle || "",
        salesPersonIds:
          companyData.salesPersonIds?.filter((id) => id.trim() !== "") || [],
        employeeCount: 0,
        employees: [],
      };

      await CompanyService.createCompany(registrationData);
      setSuccess("企業情報が正常に登録されました。");

      // Reset form after successful submission
      setCompanyData({
        name: "",
        nameKana: "",
        address: "",
        postalCode: "",
        industry: "",
        phoneNumber: "",
        email: "",
        contractModel: "",
        contractDate: "",
        paymentCycle: "",
        salesPersonIds: [""],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "登録に失敗しました。入力内容を確認してください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">基本情報登録</h1>
        <p className="mt-2 text-sm text-gray-600">
          企業の基本情報と契約情報を登録してください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <div
          className="bg-white rounded-lg shadow-sm p-6"
          style={{ borderColor: THEME_COLORS.border, borderWidth: "1px" }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                企業名{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={companyData.name}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                placeholder="株式会社○○"
                required
              />
            </div>

            <div>
              <label
                htmlFor="nameKana"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                企業名（カタカナ）{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="text"
                id="nameKana"
                name="nameKana"
                value={companyData.nameKana}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                placeholder="カブシキガイシャ○○"
                required
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                業界 <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <select
                id="industry"
                name="industry"
                value={companyData.industry}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                required
              >
                <option value="">選択してください</option>
                <option value="製造業">製造業</option>
                <option value="情報通信業">情報通信業</option>
                <option value="建設業">建設業</option>
                <option value="小売業">小売業</option>
                <option value="サービス業">サービス業</option>
                <option value="金融・保険業">金融・保険業</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                郵便番号{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={companyData.postalCode}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                placeholder="123-4567"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                住所 <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={companyData.address}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                placeholder="東京都渋谷区..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                電話番号{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={companyData.phoneNumber}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                placeholder="03-1234-5678"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                メールアドレス{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={companyData.email}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                placeholder="info@company.com"
                required
              />
            </div>
          </div>
        </div>

        {/* 契約情報 */}
        <div
          className="bg-white rounded-lg shadow-sm p-6"
          style={{ borderColor: THEME_COLORS.border, borderWidth: "1px" }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">契約情報</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contractModel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                契約モデル{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <select
                id="contractModel"
                name="contractModel"
                value={companyData.contractModel}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                required
              >
                <option value="">選択してください</option>
                <option value="ベーシック">ベーシック</option>
                <option value="スタンダード">スタンダード</option>
                <option value="プレミアム">プレミアム</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contractDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                契約日{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="date"
                id="contractDate"
                name="contractDate"
                value={companyData.contractDate}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="paymentCycle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                支払いサイト{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <select
                id="paymentCycle"
                name="paymentCycle"
                value={companyData.paymentCycle}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                required
              >
                <option value="">選択してください</option>
                <option value="月払い">月払い</option>
                <option value="年払い">年払い</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                担当営業ID{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="text"
                value={companyData.salesPersonIds?.[0] || ""}
                onChange={(e) => handleSalesPersonChange(0, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                placeholder="SALES001"
                required
              />
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: `${THEME_COLORS.status.error}20`,
              borderColor: THEME_COLORS.status.error,
              borderWidth: "1px",
            }}
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                style={{ color: THEME_COLORS.status.error }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p
                className="text-sm"
                style={{ color: THEME_COLORS.status.error }}
              >
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: `${THEME_COLORS.status.success}20`,
              borderColor: THEME_COLORS.status.success,
              borderWidth: "1px",
            }}
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
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
              <p
                className="text-sm"
                style={{ color: THEME_COLORS.status.success }}
              >
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: THEME_COLORS.accent }}
          >
            {isLoading ? "登録中..." : "登録する"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerMaster;
