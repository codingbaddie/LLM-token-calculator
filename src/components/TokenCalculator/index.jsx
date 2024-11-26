import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { AI_MODELS } from '@/config/models'
import ModelSelector from '../ModelSelector'

// 将防抖函数移到组件外部
const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const TokenCalculator = () => {
  const [text, setText] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [tokenCount, setTokenCount] = useState(0)
  const [price, setPrice] = useState(0)

  const calculateTokensAndPrice = useCallback((inputText, modelValue) => {
    if (!inputText || !modelValue) {
      setTokenCount(0)
      setPrice(0)
      return
    }

    const tokens = inputText.split(/\s+/).filter(word => word.length > 0).length
    setTokenCount(tokens)

    const selectedModelData = AI_MODELS.find(m => m.value === modelValue)
    if (selectedModelData) {
      const estimatedPrice = tokens * selectedModelData.inputPrice
      setPrice(estimatedPrice)

      saveCalculation(selectedModelData.label, inputText.length, tokens, estimatedPrice)
    }
  }, [])

  const saveCalculation = async (modelName, textLength, tokens, calculatedPrice) => {
    try {
      await supabase
        .from('calculations')
        .insert([
          {
            model: modelName,
            text_length: textLength,
            token_count: tokens,
            price: calculatedPrice,
          }
        ])
    } catch (error) {
      console.error('Error saving calculation:', error)
    }
  }

  const debouncedCalculate = useCallback(
    debounce((text, model) => calculateTokensAndPrice(text, model), 300),
    [calculateTokensAndPrice]
  )

  useEffect(() => {
    debouncedCalculate(text, selectedModel)
  }, [text, selectedModel, debouncedCalculate])

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        AI Model Token Calculator
      </h1>

      <ModelSelector 
        selectedModel={selectedModel} 
        onModelChange={setSelectedModel} 
      />

      <div style={{ marginTop: '20px' }}>
        <label
          htmlFor="text-input"
          style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
        >
          Enter your text
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '20px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: '150px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ 
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        marginTop: '20px'
      }}>
        <p style={{ marginBottom: '10px', fontSize: '18px' }}>
          Token Count: <strong>{tokenCount}</strong>
        </p>
        <p style={{ fontSize: '18px' }}>
          Estimated Price: <strong>${price.toFixed(6)}</strong>
        </p>
      </div>

      {selectedModel && (
        <p style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          Note: This is an approximate calculation. Actual token count may vary by model.
        </p>
      )}
    </div>
  )
}

export default TokenCalculator