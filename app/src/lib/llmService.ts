import type { UserProfile, DailyAdvice } from '@/types';

interface LLMAdviceResponse {
  title: string;
  description: string;
  estimatedCost: string;
  category: DailyAdvice['category'];
  tags: string[];
  reason: string;
}

export async function generateAdviceWithLLM(user: UserProfile): Promise<LLMAdviceResponse> {
  const apiKey = import.meta.env.VITE_VOLCENGINE_API_KEY;
  const model = import.meta.env.VITE_VOLCENGINE_MODEL;
  
  if (!apiKey || !model) {
    throw new Error('VolcEngine API configuration is not complete');
  }
  
  // 使用相对路径，通过Vite代理发送请求
  const apiUrl = '/api/coding/v3/chat/completions';

  console.log('Generating advice with LLM for user:', {
    age: user.age,
    city: user.city,
    lifestyle: user.lifestyle,
    budgetLevel: user.budgetLevel,
    preferences: user.preferences,
    recentActivities: user.recentActivities,
    peopleAround: user.peopleAround,
    stressLevel: user.stressLevel,
    sleepQuality: user.sleepQuality
  });

  const prompt = `
请仔细分析以下用户画像，为用户生成一个个性化的"爱自己"行动建议。

用户画像：
- 年龄：${user.age}岁
- 所在城市：${user.city}
- 生活方式：${user.lifestyle}
- 预算水平：${user.budgetLevel === 'low' ? '精打细算' : user.budgetLevel === 'medium' ? '适度享受' : user.budgetLevel === 'high' ? '品质生活' : '奢华体验'}
- 兴趣爱好：${user.preferences.join('、')}
- 最近主要活动：${user.recentActivities}
- 身边常有人数：${user.peopleAround}人
- 近期压力水平：${user.stressLevel}/10（10分最高）
- 睡眠质量：${user.sleepQuality}/10（10分最好）

请根据用户的具体情况，生成一个高度个性化的爱自己行动建议，要求：
1. 行动标题：简洁明了，直接点出核心活动
2. 详细描述：具体说明如何执行这个行动，为什么对用户有益
3. 预估成本：以人民币计算的大致花费
4. 活动类别：从以下选项中选择一个最适合的：food、experience、product、service、activity、wellness
5. 标签：3-5个能够描述这个活动特点的标签
6. 推荐理由：详细解释为什么这个活动特别适合该用户，要结合用户的具体情况

请确保建议真正符合用户的兴趣爱好、生活方式和预算水平，并且能够帮助用户缓解压力、改善心情。

请以JSON格式返回，确保格式正确，不要有任何额外的文字。JSON结构如下：
{
  "title": "行动标题",
  "description": "详细描述",
  "estimatedCost": "预估成本",
  "category": "活动类别",
  "tags": ["标签1", "标签2", "标签3"],
  "reason": "推荐理由"
}
`;

  try {
    console.log('Calling LLM API with model:', model, 'at URL:', apiUrl);
    console.log('API Key configured:', !!apiKey);
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的自我关爱顾问，擅长根据用户的具体情况生成个性化的爱自己行动建议。请仔细分析用户画像，提供真正符合用户需求的建议。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      // 移除response_format参数，因为ark-code-latest模型不支持
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('LLM API response status:', response.status);
    console.log('LLM API response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('LLM API response text:', responseText);
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.error('LLM API error details:', errorData);
        throw new Error(`LLM API error: ${errorData.error?.message || 'Unknown error'}`);
      } catch (e) {
        throw new Error(`LLM API error: ${response.status} - ${responseText}`);
      }
    }

    try {
      const data = JSON.parse(responseText);
      console.log('LLM API response data:', data);
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No choices returned from LLM API');
      }
      
      const advice = JSON.parse(data.choices[0].message.content) as LLMAdviceResponse;
      console.log('Generated advice:', advice);
      
      return advice;
    } catch (e) {
      throw new Error(`Failed to parse LLM response: ${e}`);
    }
  } catch (error) {
    console.error('Error generating advice with LLM:', error);
    throw error;
  }
}
