// 错误检查脚本
const checkErrors = async () => {
  console.log('🔍 开始检查网站错误...');
  
  try {
    // 检查网站是否可访问
    const response = await fetch('https://admirable-pony-e7a092.netlify.app');
    if (response.ok) {
      console.log('✅ 网站可访问');
    } else {
      console.log('❌ 网站访问失败:', response.status);
    }
    
    // 检查API是否正常
    const apiResponse = await fetch('https://admirable-pony-e7a092.netlify.app/api/health');
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('✅ API正常:', apiData);
    } else {
      console.log('❌ API访问失败:', apiResponse.status);
    }
    
    // 检查示例数据
    const sampleResponse = await fetch('https://admirable-pony-e7a092.netlify.app/sample-data.json');
    if (sampleResponse.ok) {
      console.log('✅ 示例数据可访问');
    } else {
      console.log('❌ 示例数据访问失败:', sampleResponse.status);
    }
    
  } catch (error) {
    console.error('❌ 检查过程中出错:', error.message);
  }
};

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  checkErrors();
}

export default checkErrors;
