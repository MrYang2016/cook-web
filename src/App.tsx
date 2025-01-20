import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { RecipeType, MenuSuggestions } from './types';
import { getRecipeOrSuggestions } from './recipeData';
import loadingImage from './assets/loading.png'; // Import the image
import shareIcon from './assets/share.png';

function App() {
  const [input, setInput] = useState('');
  const str = '玉米鸡翅煲/西兰花炒香菇/家常豆腐/油焖大虾/青椒火腿土豆片/蚝油生菜/双椒鸡丁/西芹炒木耳/青椒火腿炒蛋/鱼香肉丝/干锅土豆片/白灼菜心/宫保鸡丁/蒜蓉粉丝/玉子豆腐虾仁蒸蛋/荷塘小炒/白灼茼蒿/奥尔良烤翅/孜然土豆午餐肉/孜然鸡翅土豆条/木须鸡蛋/荷兰豆炒牛柳/西兰花炒鸡胸肉/菌菇炒火腿/茄汁豆腐抱蛋/芦笋炒虾仁/红烧排骨/菠萝咕肉/蒜苔炒肉丝/山药炒木耳珍珠糯米丸子/金钱蛋/红烧肉/四季豆炒肉丝/虾滑藕夹/红枣糯米/青椒炒杏鲍菇/茄汁金针菇/干煸四季豆/爆炒花甲/嫩滑水蒸蛋/干锅土豆片/凉拌土豆片/凉拌海带豆皮/凉拌菠菜金针菇/凉拌虾仁/凉拌紫甘蓝/凉拌莴笋丝/芙蓉鲜蔬汤/玉米冬瓜汤/丝瓜豆腐汤/番茄菌菇汤/番茄豆皮汤/上汤娃娃菜';
  const initData: MenuSuggestions = {
    recommend: ['天气冷，吃点什么好？ ', '心情抑郁，吃点什么好？ ', '手脚酸疼，吃点什么好？'].concat(...str.split('/')),
    reason: '你可以输入任何问题，或者任何描述，我都会给你推荐一个食谱或者菜单',
  };
  const [result, setResult] = useState<RecipeType | MenuSuggestions | null>(initData);
  const [loading, setLoading] = useState(false); // Add loading state
  const [title, setTitle] = useState('智能食谱助手');

  const handleLinkSearch = async (event?: React.MouseEvent<HTMLButtonElement>, newInput?: string) => {
    const str = newInput || input;
    if (str.trim() && !loading) {
      setLoading(true);
      const searchResult = await getRecipeOrSuggestions(str);
      // og:url
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://cook.aries-happy.com/${encodeURIComponent(str)}`);
      // twitter:url
      document.querySelector('meta[name="twitter:url"]')?.setAttribute('content', `https://cook.aries-happy.com/${encodeURIComponent(str)}`);
      if (searchResult && 'name' in searchResult && searchResult.name) {
        // 修改header里面的title
        document.title = `${searchResult.name}_菜谱`;
        // og:title
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${searchResult.name}_菜谱`);
        // twitter:title
        document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', `${searchResult.name}_菜谱`);
        setTitle(searchResult.name);
      }
      if (searchResult && 'description' in searchResult && searchResult.description) {
        document.querySelector('meta[name="description"]')?.setAttribute('content', searchResult.description);
        // og:description
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', searchResult.description);
        // twitter:description
        document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', searchResult.description);
      }
      // canonical
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://cook.aries-happy.com/${encodeURIComponent(str)}`);
      setResult(searchResult);
      setLoading(false);
    }
  };

  const handleSearch = async (event?: React.MouseEvent<HTMLButtonElement>, newInput?: string) => {
    const str = newInput || input;
    if (str.trim()) {
      // 跳转页面
      window.location.href = `https://cook.aries-happy.com/${encodeURIComponent(str)}`;
    }
  };

  useEffect(() => {
    // 修改：从路径中获取参数而不是查询参数
    const path = window.location.pathname;
    const inputParam = path.substring(1); // 移除开头的 '/'
    if (inputParam) {
      const decodedInput = decodeURIComponent(inputParam);
      setInput(decodedInput);
      handleLinkSearch(undefined, decodedInput);
    }
  }, []);

  const handleShare = () => {
    // 修改：使用路径而不是查询参数
    navigator.clipboard.writeText(`https://cook.aries-happy.com/${encodeURIComponent(input)}`);
    alert('已复制到剪贴板');
  };

  const renderResult = () => {
    if (!result) return null;

    if (Array.isArray((result as MenuSuggestions).recommend)) {
      return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">推荐食谱</h2>
          {/* reason */}
          <div className="mt-4">
            <p className="text-gray-600 mb-4">{(result as MenuSuggestions).reason}</p>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {(result as MenuSuggestions).recommend.map((dish, index) => (
              <li
                key={index}
                className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <a
                  href={`https://cook.aries-happy.com/${encodeURIComponent(dish)}`}
                  className="block w-full h-full"
                  title={`${dish}的详细菜谱`}  // 添加标题属性
                  rel="noopener"  // 添加安全属性
                  aria-label={`查看${dish}的完整食谱和烹饪步骤`}  // 添加无障碍标签
                >
                  {dish}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          {(result as RecipeType).name}的制作教程
          <button
            onClick={handleShare}
            className="ml-2 px-2 py-1 text-white rounded transition-colors"
          >
            <img src={shareIcon} alt="分享" className="w-4 h-4" />
          </button>
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">食材</h3>
          <ul className="grid grid-cols-2 gap-2">
            {(result as RecipeType).ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                <span>{ingredient.name}</span>
                <span className="text-gray-600">{ingredient.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">步骤</h3>
          <div className="space-y-4">
            {(result as RecipeType).steps.map((step, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">步骤 {index + 1}: {step.title}</h4>
                <p className="mb-2 text-gray-700">{step.description}</p>
                <p className="text-sm text-gray-600">原因: {step.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">小贴士</h3>
          <ul className="list-disc list-inside space-y-2">
            {(result as RecipeType).tips.map((tip, index) => (
              <li key={index} className="text-gray-700">{tip}</li>
            ))}
          </ul>
        </div>

        {/* suggestions a tag */}
        {(result as RecipeType).suggestions.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">相关推荐</h3>
            <ul className="grid grid-cols-2 gap-4">
              {(result as RecipeType).suggestions.map((suggestion, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                  <a
                    href={`https://cook.aries-happy.com/${encodeURIComponent(suggestion)}`}
                    className="block w-full h-full"
                    title={`${suggestion}的详细菜谱`}  // 添加标题属性
                    rel="noopener"  // 添加安全属性
                    aria-label={`查看${suggestion}的完整食谱和烹饪步骤`}  // 添加无障碍标签
                  >
                    {suggestion}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="输入菜名或描述（例如：'想吃辣的' 或 '宫保鸡丁'）"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            style={{ backgroundColor: '#2E7D32', color: '#fff' }}
            className="px-6 py-3 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <img src={loadingImage} alt="Loading" className="animate-spin" width={20} height={20} />
            ) : (
              <>
                <Search size={20} />
                搜索
              </>
            )}
          </button>
        </div>
        {renderResult()}
      </div>
    </div>
  );
}

export default App;