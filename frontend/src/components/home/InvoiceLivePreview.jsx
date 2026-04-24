import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import Templates1 from '../templates/Templates1';
import Templates2 from '../templates/Templates2';
import Templates3 from '../templates/Templates3';
import Templates4 from '../templates/Templates4';
import Templates5 from '../templates/Templates5';
import Templates6 from '../templates/Templates6';
import Templates7 from '../templates/Templates7';
import Templates8 from '../templates/Templates8';
import Templates9 from '../templates/Templates9';
import Templates10 from '../templates/Templates10';
import Templates11 from '../templates/Templates11';
import Templates12 from '../templates/Templates12';
import { aiDataToTemplateFormat } from '../../utils/aiDataToTemplate';

const TEMPLATES = {
  1: Templates1, 2: Templates2, 3: Templates3, 4: Templates4,
  5: Templates5, 6: Templates6, 7: Templates7, 8: Templates8,
  9: Templates9, 10: Templates10, 11: Templates11, 12: Templates12,
};

const TEMPLATE_IDS = Object.keys(TEMPLATES).map(Number);

const InvoiceLivePreview = ({ aiData, isLoggedIn, onSignInClick }) => {
  const [templateId, setTemplateId] = useState(1);

  const TemplateComponent = TEMPLATES[templateId];
  const templateData = aiDataToTemplateFormat(aiData);

  const prev = () => setTemplateId(id => {
    const idx = TEMPLATE_IDS.indexOf(id);
    return TEMPLATE_IDS[(idx - 1 + TEMPLATE_IDS.length) % TEMPLATE_IDS.length];
  });

  const next = () => setTemplateId(id => {
    const idx = TEMPLATE_IDS.indexOf(id);
    return TEMPLATE_IDS[(idx + 1) % TEMPLATE_IDS.length];
  });

  // Scale the 794px-wide template to fit the panel
  const TEMPLATE_WIDTH = 794;
  const DISPLAY_WIDTH = 420;
  const scale = DISPLAY_WIDTH / TEMPLATE_WIDTH;

  return (
    <div className="flex flex-col h-full">
      {/* Template switcher */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500">Template {templateId} / {TEMPLATE_IDS.length}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-hidden relative bg-gray-100 flex items-start justify-center pt-4 pb-4">
        <div
          style={{
            width: `${DISPLAY_WIDTH}px`,
            transformOrigin: 'top center',
            transform: `scale(${scale})`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <TemplateComponent data={templateData} />
        </div>

        {/* Blur overlay for non-logged-in users — editing locked */}
        {!isLoggedIn && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 bg-gradient-to-t from-white/80 via-transparent to-transparent">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-5 text-center max-w-xs mx-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Sign in to edit & save</p>
              <p className="text-xs text-gray-500 mb-4">Your invoice is ready. Sign in to edit, download, or send it.</p>
              <button
                onClick={onSignInClick}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all"
              >
                Sign in / Sign up free
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceLivePreview;
