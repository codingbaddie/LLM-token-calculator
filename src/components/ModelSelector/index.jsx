import { AI_MODELS } from '@/config/models'

const ModelSelector = ({ selectedModel, onModelChange }) => {
  return (
    <div>
      <label 
        htmlFor="model-select" 
        style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
      >
        Select AI Model
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      >
        <option value="">Select a model</option>
        <optgroup label="OpenAI">
          {AI_MODELS
            .filter(model => model.provider === 'OpenAI')
            .map(model => (
              <option key={model.value} value={model.value}>
                {model.label} (${model.inputPrice}/token)
              </option>
            ))}
        </optgroup>
        <optgroup label="Anthropic">
          {AI_MODELS
            .filter(model => model.provider === 'Anthropic')
            .map(model => (
              <option key={model.value} value={model.value}>
                {model.label} (${model.inputPrice}/token)
              </option>
            ))}
        </optgroup>
      </select>
    </div>
  )
}

export default ModelSelector