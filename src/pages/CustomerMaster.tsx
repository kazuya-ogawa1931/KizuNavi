import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext"; // TODO: Use when authentication is needed
import type { Company, Employee } from "../types";
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

  const [employeeCount, setEmployeeCount] = useState(1);
  const [employees, setEmployees] = useState<Partial<Employee>[]>([
    {
      email: "",
      name: "",
      department: "",
      gender: "",
      nationality: "",
      age: "",
      tenure: "",
      jobType: "",
      position: "",
      grade: "",
      evaluation: "",
      location: "",
      employmentType: "",
      recruitmentType: "",
      education: "",
      idType: "employee",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 従業員数の変更に応じて従業員リストを調整
  useEffect(() => {
    const currentLength = employees.length;
    if (employeeCount > currentLength) {
      // 従業員を追加
      const newEmployees = [...employees];
      for (let i = currentLength; i < employeeCount; i++) {
        newEmployees.push({
          email: "",
          name: "",
          department: "",
          gender: "",
          nationality: "",
          age: "",
          tenure: "",
          jobType: "",
          position: "",
          grade: "",
          evaluation: "",
          location: "",
          employmentType: "",
          recruitmentType: "",
          education: "",
          idType: "employee",
        });
      }
      setEmployees(newEmployees);
    } else if (employeeCount < currentLength) {
      // 従業員を削除
      setEmployees(employees.slice(0, employeeCount));
    }
  }, [employeeCount]);

  const handleCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    setEmployeeCount(count);
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

  const handleEmployeeChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setEmployees((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

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
        employeeCount,
        employees: employees.map((emp) => ({
          email: emp.email || "",
          name: emp.name || "",
          department: emp.department || "",
          gender: emp.gender || "",
          nationality: emp.nationality || "",
          age: emp.age || "",
          tenure: emp.tenure || "",
          jobType: emp.jobType || "",
          position: emp.position || "",
          grade: emp.grade || "",
          evaluation: emp.evaluation || "",
          location: emp.location || "",
          employmentType: emp.employmentType || "",
          recruitmentType: emp.recruitmentType || "",
          education: emp.education || "",
          idType: (emp.idType as "hr" | "employee") || "employee",
        })),
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
      setEmployeeCount(1);
      setEmployees([
        {
          email: "",
          name: "",
          department: "",
          gender: "",
          nationality: "",
          age: "",
          tenure: "",
          jobType: "",
          position: "",
          grade: "",
          evaluation: "",
          location: "",
          employmentType: "",
          recruitmentType: "",
          education: "",
          idType: "employee",
        },
      ]);
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
        <h1 className="text-3xl font-bold text-gray-900">顧客情報登録</h1>
        <p className="mt-2 text-sm text-gray-600">
          企業の基本情報と従業員情報を登録してください
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
                htmlFor="employeeCount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                従業員数{" "}
                <span style={{ color: THEME_COLORS.status.error }}>*</span>
              </label>
              <input
                type="number"
                id="employeeCount"
                value={employeeCount}
                onChange={handleEmployeeCountChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: THEME_COLORS.border }}
                min="1"
                placeholder="50"
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

        {/* 従業員情報 */}
        <div
          className="bg-white rounded-lg shadow-sm p-6"
          style={{ borderColor: THEME_COLORS.border, borderWidth: "1px" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
              従業員情報
            </h2>
          </div>

          <div className="space-y-6">
            {employees.map((employee, index) => (
              <div
                key={index}
                className="border rounded-lg p-4"
                style={{ borderColor: THEME_COLORS.border }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    従業員 {index + 1}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 基本情報 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      氏名{" "}
                      <span style={{ color: THEME_COLORS.status.error }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      value={employee.name || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      placeholder="山田太郎"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メールアドレス{" "}
                      <span style={{ color: THEME_COLORS.status.error }}>
                        *
                      </span>
                    </label>
                    <input
                      type="email"
                      value={employee.email || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "email", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      placeholder="yamada@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      所属部門{" "}
                      <span style={{ color: THEME_COLORS.status.error }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      value={employee.department || ""}
                      onChange={(e) =>
                        handleEmployeeChange(
                          index,
                          "department",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      placeholder="営業部"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      性別
                    </label>
                    <select
                      value={employee.gender || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "gender", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                    >
                      <option value="">選択してください</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                      <option value="other">その他</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      国籍
                    </label>
                    <input
                      type="text"
                      value={employee.nationality || ""}
                      onChange={(e) =>
                        handleEmployeeChange(
                          index,
                          "nationality",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      placeholder="日本"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      年代
                    </label>
                    <select
                      value={employee.age || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "age", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                    >
                      <option value="">選択してください</option>
                      <option value="10s">10代</option>
                      <option value="20s">20代</option>
                      <option value="30s">30代</option>
                      <option value="40s">40代</option>
                      <option value="50s">50代</option>
                      <option value="60s">60代</option>
                      <option value="70s">70代～</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      勤続年数
                    </label>
                    <select
                      value={employee.tenure || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "tenure", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                    >
                      <option value="">選択してください</option>
                      <option value="less-than-3">3年未満</option>
                      <option value="3-7">3-7年</option>
                      <option value="8-13">8-13年</option>
                      <option value="14-20">14-20年</option>
                      <option value="20-plus">20年以上</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      職種
                    </label>
                    <input
                      type="text"
                      value={employee.jobType || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "jobType", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      placeholder="営業"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      職位
                    </label>
                    <input
                      type="text"
                      value={employee.position || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "position", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      placeholder="主任"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      等級
                    </label>
                    <input
                      type="text"
                      value={employee.grade || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "grade", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      placeholder="3級"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      人事評価
                    </label>
                    <select
                      value={employee.evaluation || ""}
                      onChange={(e) =>
                        handleEmployeeChange(
                          index,
                          "evaluation",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                    >
                      <option value="">選択してください</option>
                      <option value="S">S</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      勤務地
                    </label>
                    <input
                      type="text"
                      value={employee.location || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "location", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      placeholder="東京本社"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      雇用形態
                    </label>
                    <select
                      value={employee.employmentType || ""}
                      onChange={(e) =>
                        handleEmployeeChange(
                          index,
                          "employmentType",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                    >
                      <option value="">選択してください</option>
                      <option value="regular">正社員</option>
                      <option value="contract">契約社員</option>
                      <option value="part-time">パート・アルバイト</option>
                      <option value="temporary">派遣社員</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      採用区分
                    </label>
                    <select
                      value={employee.recruitmentType || ""}
                      onChange={(e) =>
                        handleEmployeeChange(
                          index,
                          "recruitmentType",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                    >
                      <option value="">選択してください</option>
                      <option value="new-graduate">新卒</option>
                      <option value="mid-career">中途</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      最終学歴
                    </label>
                    <select
                      value={employee.education || ""}
                      onChange={(e) =>
                        handleEmployeeChange(index, "education", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                    >
                      <option value="">選択してください</option>
                      <option value="high-school">高等学校</option>
                      <option value="vocational">専門学校</option>
                      <option value="college">短期大学</option>
                      <option value="university">大学</option>
                      <option value="graduate">大学院</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID種別{" "}
                      <span style={{ color: THEME_COLORS.status.error }}>
                        *
                      </span>
                    </label>
                    <select
                      value={employee.idType || "employee"}
                      onChange={(e) =>
                        handleEmployeeChange(index, "idType", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THEME_COLORS.border }}
                      required
                    >
                      <option value="sales">営業ID（マスタ権限）</option>
                      <option value="hr">人事ID（アドミン権限）</option>
                      <option value="employee">従業員ID（メンバー権限）</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
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
