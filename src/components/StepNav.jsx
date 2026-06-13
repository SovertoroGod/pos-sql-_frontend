import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StepNav = ({ steps }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1 text-sm mb-4 flex-wrap">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            {isLast ? (
              <span className="font-semibold text-emerald-600">
                {step.label}
              </span>
            ) : (
              <button
                onClick={() => step.path && navigate(step.path)}
                className={`hover:text-emerald-600 transition-colors ${
                  step.path
                    ? "text-gray-500 cursor-pointer"
                    : "text-gray-500 cursor-default"
                }`}
              >
                {step.label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepNav;
