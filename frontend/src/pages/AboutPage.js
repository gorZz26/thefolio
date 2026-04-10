import React from 'react';
// Import images - ensure these are in src/assets/
import about1 from '../assets/about1.jpg';
import about2 from '../assets/about2.jpg';
import movie1 from '../assets/movie1.png';
import movie2 from '../assets/movie2.png';
import movie3 from '../assets/movie3.png';
import series1 from '../assets/series1.png';
import series2 from '../assets/series2.png';
import series3 from '../assets/series3.png';
import anime1 from '../assets/anime1.png';
import anime2 from '../assets/anime2.png';
import anime3 from '../assets/anime3.png';
import manga1 from '../assets/manga1.png';
import manga2 from '../assets/manga2.png';
import manga3 from '../assets/manga3.png';
import manhwa1 from '../assets/manhwa1.png';
import manhwa2 from '../assets/manhwa2.png';
import manhwa3 from '../assets/manhwa3.png';
import manhua1 from '../assets/manhua1.png';
import manhua2 from '../assets/manhua2.png';
import manhua3 from '../assets/manhua3.png';

function AboutPage() {
  return (
    <main>
      {/* PERSONAL NARRATIVE SECTION */}
      <section>
        <div className="section-inner">
          <div className="text-content" style={{ textAlign: 'justify' }}>
            <h2>From Isolation to Connection: How Boys Love Redefined My World</h2>
            <img src={about1} className="wrap-image" alt="About isolation" />
            <p>
              The year 2020 is often remembered for its silence—the quiet of empty streets and the heavy isolation of the COVID-19 pandemic. 
              For me, however, that silence was eventually filled with the vibrant, emotional, and transformative world of "Boys Love" (BL). 
              What started as a way to pass the time during a global lockdown quickly evolved into a source of profound happiness that, quite literally, brought me back to life.
            </p>
            <br />
            <p>
              During the height of the lockdowns, the world felt small and uncertain. BL dramas provided a much-needed escape, 
              offering stories of tenderness, vulnerability, and romance that contrasted sharply with the anxiety of the outside world.
            </p>
            <br />
            <p>
              However, the impact of BL extended far beyond the screen. The most remarkable gift this genre gave me was a sense of belonging. 
              Through online forums and social media groups, I joined a global family.
            </p>
            <br />
            <p>
              It has now been six years since those first virtual introductions, and the bonds created during that time remain as strong as ever. 
              The people I met online in 2020 are still a part of my life today.
            </p>
            <br />
            <p>
              Looking back, BL was more than just a hobby; it was the catalyst for a community that rescued me from loneliness. 
              Six years later, I am not just a fan of a genre; I am a member of a community that gave me a second lease on life.
            </p>
          </div>
        </div>
      </section>

      {/* JOURNEY LIST SECTION */}
      <section className="reverse">
        <div className="section-inner">
          <div className="text-content">
            <h2>My Journey With This Genre</h2>
            <img src={about2} className="wrap-image" alt="My journey" />
            <ol style={{ textAlign: 'justify' }}>
              <li>
                My journey into the world of Boys Love began with the intricate ink and paper of manga and manhwa. 
                There is a unique intimacy in reading these stories that allowed me to immerse myself deeply in the characters' inner monologues.
              </li>
              <br />
              <li>
                As my interest grew, I moved from the page to the screen by discovering BL anime. 
                Seeing my favorite stories come to life with movement, color, and voice acting added a new dimension to the experience.
              </li>
              <br />
              <li>
                The next natural step was the world of live-action dramas and movies. This transition brought a different level of realism. 
                Productions from Thailand, Japan, and Korea offered a cultural lens that enriched my understanding of identity.
              </li>
              <br />
              <li>
                Eventually, I found myself doing more than just consuming content; I began to analyze it. 
                I became fascinated by the nuances of adaptation—how a specific scene in a manhwa is reimagined for a live-action series.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section className="section-inner">
        <blockquote style={{ textAlign: 'center' }}>
          “Stories connect people across cultures, formats, and experiences.”
        </blockquote>
      </section>

      {/* TOP 3 SECTIONS */}
      <Top3Section title="My Top 3 BL Movies" items={[
        { img: movie1, title: "Your Name Engraved Herein", desc: "Set in 1980s Taiwan, two boys navigate forbidden love, religion, and societal pressure." },
        { img: movie2, title: "Marry My Dead Body", desc: "A mix of BL, comedy, and mystery where a cop is forced into a ghost marriage with a gay man." },
        { img: movie3, title: "God’s Own Country", desc: "A raw rural romance between a lonely English farmer and a migrant worker focusing on intimacy." }
      ]} />

      <Top3Section title="My Top 3 BL Series" items={[
        { img: series1, title: "Until We Meet Again", desc: "A tender reincarnation romance where two students uncover a tragic love story from their past." },
        { img: series2, title: "I Told Sunset About You", desc: "A beautifully shot coming-of-age story about childhood friends reconnecting amid identity struggles." },
        { img: series3, title: "Heartstopper", desc: "A wholesome, soft BL about a shy boy and a popular rugby player whose friendship blossoms into first love." }
      ]} />

      <Top3Section title="My Top 3 BL Anime" items={[
        { img: anime1, title: "Given", desc: "A heartfelt story about grief, music, and love as a high school band forms and two boys connect." },
        { img: anime2, title: "Junjou Romantica", desc: "A classic BL featuring multiple couples navigating romance, misunderstandings, and passion." },
        { img: anime3, title: "Sasaki and Miyano", desc: "A gentle, slow-burn high school BL about friendship evolving into love through shared interests." }
      ]} />

      <Top3Section title="My Top 3 BL Manga" items={[
        { img: manga1, title: "Haruka Tooki Ie", desc: "A melancholic, atmospheric story exploring memory, distance, and lingering feelings." },
        { img: manga2, title: "Mask Danshi wa Koi Shitakunai no ni", desc: "A comedic romance where a scary-looking guy insists he doesn’t want love while falling hard." },
        { img: manga3, title: "Kedamono Arashi", desc: "An omegaverse BL filled with intense emotions, family bonds, and instinct-driven romance." }
      ]} />

      <Top3Section title="My Top 3 BL Manhwa" items={[
        { img: manhwa1, title: "Cherry Blossoms After Winter", desc: "A sweet, domestic slow-burn about childhood friends turned housemates whose feelings deepen." },
        { img: manhwa2, title: "Love Is an Illusion", desc: "An omegaverse BL where a dominant alpha unexpectedly falls for a strong-willed omega." },
        { img: manhwa3, title: "King’s Maker", desc: "A political fantasy BL about power, revenge, and devotion between a prince and a strategist." }
      ]} />

      <Top3Section title="My Top 3 BL Manhua" items={[
        { img: manhua1, title: "Deliverance of the Counterattack", desc: "A dramatic revenge-turned-romance story where an underestimated man transforms himself." },
        { img: manhua2, title: "Here U Are", desc: "A realistic, slow-burn college BL focusing on awkward first meetings and gradual intimacy." },
        { img: manhua3, title: "Pirouette Into My Heart", desc: "A light romance centered around dance, where two young men grow closer through shared passion." }
      ]} />
    </main>
  );
}

// HELPER COMPONENT FOR THE REPETITIVE TOP 3 GRIDS
function Top3Section({ title, items }) {
  return (
    <section className="top3-section">
      <h2 style={{ textAlign: 'center' }}>{title}</h2>
      <div className="top3-grid">
        {items.map((item, index) => (
          <div key={index} className="top3-item">
            <img src={item.img} alt={item.title} />
            <h3 style={{ textAlign: 'center' }}>{item.title}</h3>
            <p style={{ textAlign: 'center' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AboutPage;