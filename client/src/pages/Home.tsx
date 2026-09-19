import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Heart,
  Instagram,
  Menu,
  Search,
  Send,
  Sparkles,
  Star,
  Utensils,
  X,
  Youtube,
} from "lucide-react";

type Recipe = {
  id: number;
  title: string;
  type: string;
  time: string;
  level: string;
  image: string;
  accent: string;
  description: string;
  tags: string[];
  featured?: boolean;
};

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Charred lemon noodles",
    type: "15-minute wonder",
    time: "15 min",
    level: "Easy",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=88",
    accent: "#e6fb62",
    description: "Silky noodles, blistered lemon, and just enough chilli to wake everything up.",
    tags: ["quick", "vegetarian"],
    featured: true,
  },
  {
    id: 2,
    title: "Green room shakshuka",
    type: "Slow Sunday",
    time: "32 min",
    level: "Medium",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=88",
    accent: "#ff8f70",
    description: "A herby skillet of greens, eggs, and feta for when brunch needs a little drama.",
    tags: ["brunch", "vegetarian"],
  },
  {
    id: 3,
    title: "Crisp-edged dumplings",
    type: "The crowd pleaser",
    time: "24 min",
    level: "Easy",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=88",
    accent: "#ffcf70",
    description: "Pan-fried pockets, a glossy dipping sauce, and zero need to share.",
    tags: ["weeknight", "shareable"],
  },
  {
    id: 4,
    title: "Miso butter beans",
    type: "Pantry magic",
    time: "18 min",
    level: "Easy",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=88",
    accent: "#a3e7d0",
    description: "Creamy beans, miso, herbs, and a piece of toast sturdy enough for the job.",
    tags: ["pantry", "comfort"],
  },
  {
    id: 5,
    title: "Coconut crunch salad",
    type: "A bright reset",
    time: "12 min",
    level: "Easy",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=88",
    accent: "#e6fb62",
    description: "Cool greens, toasted coconut, and a dressing that tastes like a tiny holiday.",
    tags: ["fresh", "vegetarian"],
  },
  {
    id: 6,
    title: "Sticky tomato chicken",
    type: "Big table energy",
    time: "45 min",
    level: "Medium",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=88",
    accent: "#ff8f70",
    description: "Sweet, savoury, glossy, and built for the kind of dinner that runs late.",
    tags: ["dinner", "high-protein"],
  },
];

const moods = [
  { label: "I have 10 minutes", value: "quick", icon: Clock3, color: "mint" },
  { label: "Feed a few friends", value: "shareable", icon: Utensils, color: "coral" },
  { label: "Use what I have", value: "pantry", icon: Sparkles, color: "lime" },
];

function GlassButton({
  children,
  onClick,
  variant = "dark",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "dark" | "lime" | "ghost";
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`glass-button ${variant === "lime" ? "glass-button-lime" : ""} ${variant === "ghost" ? "glass-button-ghost" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function RecipeCard({ recipe, saved, onSave, onView }: { recipe: Recipe; saved: boolean; onSave: () => void; onView: () => void }) {
  return (
    <article className={`recipe-card ${recipe.featured ? "recipe-card-featured" : ""}`}>
      <div className="recipe-image-wrap">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" loading="lazy" />
        <div className="image-overlay" />
        <div className="recipe-topline">
          <span className="recipe-tag" style={{ color: recipe.accent, borderColor: `${recipe.accent}55` }}>{recipe.type}</span>
          <button className={`save-button ${saved ? "is-saved" : ""}`} onClick={onSave} aria-label={saved ? `Remove ${recipe.title} from saved recipes` : `Save ${recipe.title}`}>
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="recipe-image-copy">
          <div className="recipe-metric"><Clock3 size={14} /> {recipe.time}</div>
          <div className="recipe-metric"><Flame size={14} /> {recipe.level}</div>
        </div>
      </div>
      <div className="recipe-card-body">
        <div>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </div>
        <button className="circle-arrow" onClick={onView} aria-label={`View ${recipe.title}`}><ArrowUpRight size={18} /></button>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [saved, setSaved] = useState<number[]>([3]);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesFilter = activeFilter === "all" || recipe.tags.includes(activeFilter);
      const matchesSearch = !normalizedSearch || `${recipe.title} ${recipe.type} ${recipe.tags.join(" ")}`.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const toggleSaved = (id: number) => {
    setSaved((current) => current.includes(id) ? current.filter((recipeId) => recipeId !== id) : [...current, id]);
    const recipe = recipes.find((item) => item.id === id);
    toast(saved.includes(id) ? `${recipe?.title} removed from your list` : `${recipe?.title} saved for later`, { icon: saved.includes(id) ? <X size={16} /> : <Check size={16} /> });
  };

  const handleFilter = (value: string) => {
    setActiveFilter(value);
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openRecipe = (recipe: Recipe) => setSelectedRecipe(recipe);

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="announcement-bar">
        <div className="announcement-pulse" />
        <span>Kitchen beta 01</span>
        <span className="announcement-separator">/</span>
        <span>Recipes for whatever mood you’re in</span>
        <button onClick={() => toast("You’re already on the list — welcome in.")}>Join the inner circle <ArrowUpRight size={13} /></button>
      </div>

      <header className="site-nav">
        <a href="#top" className="brand-lockup" aria-label="Anything and Cook home">
          <span className="brand-mark"><span /> <span /> <span /></span>
          <span className="brand-name">anything <em>&</em> cook</span>
        </a>
        <nav className={`main-nav ${mobileMenu ? "is-open" : ""}`}>
          <a href="#discover" onClick={() => setMobileMenu(false)}>Discover</a>
          <a href="#moods" onClick={() => setMobileMenu(false)}>Mood kitchen</a>
          <a href="#journal" onClick={() => setMobileMenu(false)}>The journal</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>About us</a>
        </nav>
        <div className="nav-actions">
          <button className="saved-count" onClick={() => toast(`${saved.length} recipe${saved.length === 1 ? "" : "s"} saved in your kitchen`)}><Bookmark size={15} fill="currentColor" /> <span>{saved.length}</span></button>
          <GlassButton variant="lime" onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}>Find a recipe <ArrowDownRight size={15} /></GlassButton>
          <button className="menu-button" onClick={() => setMobileMenu((open) => !open)} aria-label="Toggle navigation">{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy reveal-up">
          <div className="eyebrow"><span className="eyebrow-line" /> The anti-recipe recipe club</div>
          <h1>Make something<br /><span>worth tasting.</span></h1>
          <p className="hero-lede">Good food doesn’t need a personality test. Start with what’s in the fridge, follow your instincts, and leave room for the delicious bit you didn’t plan.</p>
          <div className="hero-actions">
            <GlassButton variant="lime" onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}>Explore the kitchen <ArrowDownRight size={16} /></GlassButton>
            <button className="text-link" onClick={() => toast("Your pantry is full of good ideas.")}><Sparkles size={15} /> Give me a wild card</button>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack"><span>AC</span><span>MN</span><span>JS</span><span>+4k</span></div>
            <div><div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><span>Loved by curious cooks</span></div>
          </div>
        </div>

        <div className="hero-visual reveal-up delay-one">
          <div className="hero-image-card">
            <img src="https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1400&q=90" alt="Colourful fresh salad on a table" />
            <div className="hero-image-shade" />
            <div className="hero-visual-label"><span className="live-dot" /> Right now in the kitchen</div>
            <div className="hero-image-caption"><span>01</span><strong>Crunchy things<br />in a soft world.</strong><ArrowUpRight size={20} /></div>
          </div>
          <div className="floating-note note-top"><div className="note-icon lime"><Flame size={15} /></div><div><strong>98%</strong><span>good mood<br />guaranteed</span></div></div>
          <div className="floating-note note-bottom"><div className="note-icon coral"><Clock3 size={15} /></div><div><strong>12 min</strong><span>from thought<br />to first bite</span></div></div>
          <div className="orbit-label"><span>taste / instinct / play</span><ArrowDownRight size={15} /></div>
        </div>
      </section>

      <section className="search-strip glass-panel reveal-up delay-two">
        <div className="search-label"><Search size={18} /><span>Search the pantry</span></div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try “crispy”, “noodles”, or “something green”" aria-label="Search recipes" />
        <div className="search-hint"><span>⌘</span><span>K</span></div>
      </section>

      <section className="marquee-band" aria-label="Anything and Cook mantra">
        <div className="marquee-track"><span>cook with instinct</span><i>✳</i><span>make room for more</span><i>✳</i><span>good enough is delicious</span><i>✳</i><span>cook with instinct</span><i>✳</i><span>make room for more</span></div>
      </section>

      <section className="discover-section content-section" id="discover">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> Curated for right now</div><h2>What’s good<br /><em>tonight?</em></h2></div>
          <div className="section-aside"><p>Recipes with a little give in them. Swap the greens, skip the garnish, double the sauce. Nothing here is precious.</p><a href="#journal" className="underlined-link">Read our kitchen notes <ArrowUpRight size={15} /></a></div>
        </div>
        <div className="filter-row">
          {[["all", "Everything"], ["quick", "Quick wins"], ["vegetarian", "Plant-forward"], ["pantry", "Pantry magic"], ["shareable", "For sharing"]].map(([value, label]) => <button key={value} className={`filter-pill ${activeFilter === value ? "active" : ""}`} onClick={() => setActiveFilter(value)}>{label}</button>)}
          <span className="result-count">{filteredRecipes.length} recipes</span>
        </div>
        <div className="recipe-grid">
          {filteredRecipes.length > 0 ? filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} saved={saved.includes(recipe.id)} onSave={() => toggleSaved(recipe.id)} onView={() => openRecipe(recipe)} />) : <div className="empty-state glass-panel"><Sparkles size={28} /><h3>Nothing by that name yet.</h3><p>Try a different ingredient or let the kitchen surprise you.</p><button className="underlined-link" onClick={() => { setSearch(""); setActiveFilter("all"); }}>Reset the pantry</button></div>}
        </div>
      </section>

      <section className="mood-section content-section" id="moods">
        <div className="mood-intro"><div className="eyebrow"><span className="eyebrow-line" /> No wrong answers here</div><h2>Pick a mood.<br /><em>We’ll do the rest.</em></h2><p>Not every meal needs a master plan. Choose your energy and we’ll point you toward something with the right kind of chaos.</p></div>
        <div className="mood-list">{moods.map(({ label, value, icon: Icon, color }, index) => <button key={value} className={`mood-card mood-${color}`} onClick={() => handleFilter(value)}><span className="mood-index">0{index + 1}</span><span className="mood-icon"><Icon size={21} /></span><strong>{label}</strong><ArrowUpRight size={19} className="mood-arrow" /></button>)}</div>
      </section>

      <section className="process-section content-section" id="journal">
        <div className="process-top"><div className="eyebrow"><span className="eyebrow-line" /> A very short manifesto</div><p>We’re here for the meals that happen when you stop measuring every good thing.</p></div>
        <div className="process-grid"><div className="process-number">03<span>/</span></div><div className="process-copy"><h2>Make it <em>yours.</em></h2><p>Start anywhere. Change everything. A recipe is a suggestion with good intentions — your kitchen is where it becomes a story.</p><button className="underlined-link" onClick={() => toast("The journal is simmering. More notes coming soon.")}>Read the full note <ArrowUpRight size={15} /></button></div><div className="process-quote glass-panel"><Sparkles size={18} /><p>“The best ingredient is the one you’re excited to use.”</p><span>— the anything kitchen</span></div></div>
      </section>

      <section className="newsletter-section content-section" id="about">
        <div className="newsletter-card"><div className="newsletter-orb orb-one" /><div className="newsletter-orb orb-two" /><div className="eyebrow"><span className="eyebrow-line" /> The good stuff, occasionally</div><h2>A little taste<br /><em>in your inbox.</em></h2><p>One curious recipe, one useful idea, and absolutely no “10 ways to use leftover quinoa”.</p><form onSubmit={(event) => { event.preventDefault(); toast("You’re in. Check your inbox for a little kitchen hello."); }}><input type="email" required placeholder="your@email.com" aria-label="Email address" /><button type="submit" aria-label="Subscribe"><Send size={17} /></button></form><small>Unsubscribe anytime. We’re not clingy.</small></div>
      </section>

      <footer className="site-footer"><a href="#top" className="brand-lockup"><span className="brand-mark"><span /> <span /> <span /></span><span className="brand-name">anything <em>&</em> cook</span></a><span className="footer-note">Made for the hungry & curious · 2026</span><div className="social-links"><button onClick={() => toast("Instagram is where the crumbs live.")} aria-label="Instagram"><Instagram size={17} /></button><button onClick={() => toast("The playlist is currently simmering.")} aria-label="Youtube"><Youtube size={18} /></button><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"><ArrowUpRight size={17} /></button></div></footer>

      {selectedRecipe && <div className="modal-backdrop" onClick={() => setSelectedRecipe(null)}><div className="recipe-modal glass-panel" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedRecipe(null)} aria-label="Close recipe"><X size={19} /></button><img src={selectedRecipe.image} alt="" /><div className="modal-content"><div className="eyebrow"><span className="eyebrow-line" /> {selectedRecipe.type}</div><h2>{selectedRecipe.title}</h2><p>{selectedRecipe.description}</p><div className="modal-meta"><span><Clock3 size={15} /> {selectedRecipe.time}</span><span><Flame size={15} /> {selectedRecipe.level}</span><span><Heart size={15} /> feels good</span></div><div className="ingredient-note"><strong>Tonight’s move</strong><span>Get your pan properly hot, trust the colour, and add a little more lemon than feels sensible.</span></div><GlassButton variant="lime" onClick={() => { toggleSaved(selectedRecipe.id); setSelectedRecipe(null); }}>{saved.includes(selectedRecipe.id) ? "Saved to your kitchen" : "Save this one"} <Bookmark size={15} fill={saved.includes(selectedRecipe.id) ? "currentColor" : "none"} /></GlassButton></div></div></div>}
    </main>
  );
}
