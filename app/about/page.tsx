export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">من نحن – 3 CHERRY</h1>

        <a
          href="/dashboard"
          className="inline-block bg-slate-800 px-4 py-2 rounded-xl hover:bg-slate-700"
        >
          ← العودة للوحة التحكم
        </a>
      </header>

      {/* Main content */}
      <section className="max-w-4xl mx-auto space-y-8 leading-relaxed text-gray-200">
        
        {/* What is 3CHERRY */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-red-400">ما هي منصة 3 CHERRY؟</h2>
          <p>
            3 CHERRY هي منصة تداول حديثة تعتمد على الذكاء الاصطناعي لتقديم 
            توصيات دقيقة، تحليل احترافي للذهب، وبرامج تدريب مصممة خصيصاً 
            للمتداولين المبتدئين والمتقدمين. هدفنا هو جعل رحلة التداول أكثر 
            وضوحاً، وأكثر أماناً، وأكثر احترافية.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-emerald-400">رؤيتنا</h2>
          <p>
            نهدف إلى بناء نظام تداول ذكي يساعد المستخدم على اتخاذ قرارات مدروسة 
            تعتمد على البيانات والتحليل، وليس على العشوائية أو العاطفة. 
            نريد أن يكون التداول تجربة تعليمية، واضحة، وآمنة، 
            مبنية على علم وإحصائيات وحسابات دقيقة.
          </p>
        </div>

        {/* Who is Hazem? */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-blue-400">من هو Hazem Abo Moghdeb؟</h2>
          <p>
            مؤسس مشروع 3 CHERRY ومدير تطوير الأعمال. يتمتع بخبرة في الأسواق 
            المالية وإدارة حسابات العملاء وتطوير مشاريع التداول الاحترافية. 
            عمل مع العديد من الشركات في مجال التداول، ويدير اليوم مشروع 3 CHERRY 
            لتقديم تجربة تداول فريدة تجمع بين الذكاء الاصطناعي، الخبرة العملية، 
            والأساليب الحديثة في التدريب الاحترافي.
          </p>
        </div>

        {/* Why choose us? */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-yellow-400">لماذا 3 CHERRY؟</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>توصيات تعتمد على الذكاء الاصطناعي لضمان أعلى دقة ممكنة.</li>
            <li>تحليل فوري للذهب يتجدد باستمرار.</li>
            <li>نظام تدريب احترافي يناسب كل المستويات.</li>
            <li>منصة مبنية بواجهة بسيطة وأداء عالي.</li>
            <li>تجربة مستخدم فخمة وسهلة التصفح.</li>
          </ul>
        </div>

        {/* Final Message */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-purple-400">رسالتنا للمستخدم</h2>
          <p>
            نسعى لنكون شريكك الحقيقي في رحلة التداول.  
            هدفنا ليس فقط أن تتداول، بل أن تفهم ما تفعل، 
            وأن تمتلك الأدوات الصحيحة لتطوير نفسك وتحقيق أهدافك في السوق.  
            أهلاً بك في 3 CHERRY — حيث نضع **الذكاء، الدقة، والفخامة** في قلب كل قرار تداول.
          </p>
        </div>

      </section>
    </main>
  );
}
