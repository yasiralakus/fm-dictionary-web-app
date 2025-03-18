import { useEffect, useState } from "react";

export default function App() {
    const [search, setSearch] = useState('welcome');
    const [wordData, setWordData] = useState(null);
    const [font, setFont] = useState('sans-serif');

    const handleFontChange = (event) => {
        setFont(event.target.value);
    };

    useEffect(() => {
        async function fetchData() {
            let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`).then(r => r.json());
            setWordData(data[0]);
        }
        fetchData();
    }, [search]);

    async function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${formObj.word}`).then(r => r.json());
        setWordData(data[0]);
    }

    function playSound() {
        let audioUrl = '';

        for (let i = 0; i < 10; i++) {
            if (wordData?.phonetics?.[i]?.audio) {
                audioUrl = wordData.phonetics[i].audio;
                break;
            }
        }
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    }

    return (
        <div className="full-page" style={{ fontFamily: font }}>
            <div className="main-box">
                <header className="header">
                    <img src="./images/logo.svg" alt="" />
                    <select value={font} onChange={handleFontChange}>
                        <option value="sans-serif">Sans Serif</option>
                        <option value="PT Serif, serif">Serif</option>
                        <option value="Roboto Mono, monospace">Mono</option>
                    </select>
                </header>

                <form onSubmit={handleSearch} className="search-bar">
                    <input autoComplete="off" required type="text" placeholder="Enter Word" name="word" />
                    <button><img src="./images/icon-search.svg" alt="" /></button>
                </form>

                {wordData === undefined ?
                    <div className="null">
                        <img src="./images/face.png" alt="" />
                        <h1>No Definitions Found</h1>
                        <p>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
                    </div>
                    :
                    <>
                        <main className="main">
                            <div className="word">
                                <h1>{wordData?.word}</h1>
                                <p>{wordData?.phonetic}</p>
                                <button title="Listen" onClick={playSound}><img src="./images/icon-play.svg" alt="" /></button>
                            </div>
                        </main>

                        <div className="noun">
                            <header>
                                <h1>noun</h1>
                                <div></div>
                            </header>

                            <main>
                                <h2>Meaning</h2>
                                {
                                    wordData?.meanings?.[0]?.definitions?.map((x, index) => (
                                        <div className="ex-item" key={index}>
                                            <div></div>
                                            <p>{x.definition}</p>
                                        </div>
                                    ))
                                }
                            </main>

                            <footer>
                                <h2>Synonyms</h2>
                                <p onClick={() => (setSearch(wordData?.meanings?.[0]?.synonyms[0]))}>{wordData?.meanings?.[0]?.synonyms[0]}</p>
                            </footer>
                        </div>

                        <div className="verb">
                            <header>
                                <h1>verb</h1>
                                <div></div>
                            </header>

                            <main>
                                <h2>Meaning</h2>
                                {
                                    wordData?.meanings?.[1]?.definitions?.map((x, index) => (
                                        <div className="ex-item" key={index}>
                                            <div></div>
                                            <p>{x.definition}</p>
                                        </div>
                                    ))
                                }
                            </main>
                        </div>

                        <div className="source">
                            <p>Source</p>
                            <a href="https://en.wiktionary.org/wiki/keyboard">https://en.wiktionary.org/wiki/keyboard <img src="./images/icon-new-window.svg" alt="" /></a>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}
