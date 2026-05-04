import t1 from "../../assets/templates/images/1.jpg";
import t2 from "../../assets/templates/images/2.jpg";
import t3 from "../../assets/templates/images/3.png";
import t4 from "../../assets/templates/images/4.jpg";
import t5 from "../../assets/templates/images/5.jpg";
import t6 from "../../assets/templates/images/6.jpg";
import t7 from "../../assets/templates/images/7.png";
import t8 from "../../assets/templates/images/8.jpg";
import t9 from "../../assets/templates/images/9.jpg";
import t10 from "../../assets/templates/images/10.jpg";
import t11 from "../../assets/templates/images/11.jpg";
import t12 from "../../assets/templates/images/12.png";

export const TEMPLATES = [
  { id: 1, name: "Template 1", preview: t1 },
  { id: 2, name: "Template 2", preview: t2 },
  { id: 3, name: "Template 3", preview: t3 },
  { id: 4, name: "Template 4", preview: t4 },
  { id: 5, name: "Template 5", preview: t5 },
  { id: 6, name: "Template 6", preview: t6 },
  { id: 7, name: "Template 7", preview: t7 },
  { id: 8, name: "Template 8", preview: t8 },
  { id: 9, name: "Template 9", preview: t9 },
  { id: 10, name: "Template 10", preview: t10 },
  { id: 11, name: "Template 11", preview: t11 },
  { id: 12, name: "Template 12", preview: t12 },
];

const TemplatePicker = ({ onSelect, selectedId, readOnly = false }) => (
  <div className="mt-3 w-full">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {readOnly ? "Selected template" : "Choose a template"}
    </p>
    <div className="grid grid-cols-3 gap-3">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => !readOnly && onSelect(t)}
          disabled={readOnly}
          className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
            readOnly ? "cursor-default" : "hover:scale-105 hover:shadow-lg"
          } ${
            selectedId === t.id
              ? "border-indigo-500 shadow-md shadow-indigo-200"
              : `border-gray-200 ${!readOnly ? "hover:border-indigo-300" : ""}`
          }`}
        >
          <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center overflow-hidden">
            <img
              src={t.preview}
              alt={t.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div
            className={`px-2 py-1.5 flex items-center justify-between border-t ${
              selectedId === t.id
                ? "bg-indigo-50 border-indigo-200"
                : "bg-white border-gray-100"
            }`}
          >
            <span
              className={`text-[11px] font-medium ${selectedId === t.id ? "text-indigo-600" : "text-gray-500"}`}
            >
              {t.name}
            </span>
            {selectedId === t.id && (
              <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                <svg
                  className="w-2 h-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default TemplatePicker;
