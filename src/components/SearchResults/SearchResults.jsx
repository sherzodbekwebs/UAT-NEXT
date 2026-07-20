// import React from 'react';
// import { useSearchParams, Link } from '../../router-shim.js';
// import { newsData } from '../newsData/newsData';
// import { Calendar, ArrowRight, SearchX } from 'lucide-react';

// const SearchResults = ({ lang }) => {
//     const [searchParams] = useSearchParams();
//     const query = searchParams.get("q")?.toLowerCase() || "";

//     // Ma'lumotlarni qidirish (Sarlavha va Tavsif ichidan)
//     const results = newsData.filter(item => 
//         item[lang].title.toLowerCase().includes(query) || 
//         item[lang].desc.toLowerCase().includes(query)
//     );

//     return (
//         <div className="pt-32 pb-20 bg-[#F8FAFC] min-h-screen font-inter">
//             <div className="max-w-[1440px] mx-auto px-8">
//                 <div className="mb-12">
//                     <h1 className="text-3xl font-medium text-gray-500">
//                         {lang === 'ru' ? 'Результаты поиска по запросу:' : 'Qidiruv natijalari:'} 
//                         <span className="text-[#1a2e44] font-black ml-2">"{query}"</span>
//                     </h1>
//                     <p className="mt-2 text-gray-400 font-bold uppercase text-xs tracking-widest">
//                         {lang === 'ru' ? `Найдено: ${results.length}` : `Topildi: ${results.length}`}
//                     </p>
//                 </div>

//                 {results.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {results.map((item) => (
//                             <div key={item.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
//                                 <img src={item.image} className="h-56 w-full object-cover" alt="" />
//                                 <div className="p-8 flex flex-col flex-1">
//                                     <h3 className="text-xl font-bold text-[#1a2e44] mb-4 line-clamp-2">{item[lang].title}</h3>
//                                     <Link to={`/news/${item.id}`} className="mt-auto inline-flex items-center gap-2 text-sm font-black text-[#0054A6] uppercase tracking-widest">
//                                         {lang === 'ru' ? 'Подробнее' : 'Batafsil'} <ArrowRight size={16} />
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-50">
//                         <SearchX size={64} className="text-gray-200 mb-6" />
//                         <h2 className="text-2xl font-bold text-gray-400">
//                             {lang === 'ru' ? 'Ничего не найдено' : 'Hech narsa topilmadi'}
//                         </h2>
//                         <Link to="/" className="mt-6 text-[#0054A6] font-black uppercase text-xs tracking-widest hover:underline">
//                             {lang === 'ru' ? 'Вернуться на главную' : 'Bosh sahifaga qaytish'}
//                         </Link>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SearchResults;