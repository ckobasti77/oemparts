/**
 * Asortiman: 10 sistema i 44 grupe delova (izvor: _izvor/autodelovi/data/car.manifest.json i
 * data/seed/categories.ts.txt, sa ispravkama iz plana K01 §6.4; K04 je napisao uvode, savete za
 * upit i meta opise sistema i pregledao svih 44 + 4 teksta). Slug grupe je ime rendera
 * public/images/delovi/<slug>.webp. Pomoćnici su u lib/asortiman.ts.
 * Fajl nema value importe i koristi samo brisivu TS sintaksu (scripts/ ga učitavaju direktno).
 */

export type SistemSlug =
  | "motor-i-usis"
  | "izduvni-sistem"
  | "hladjenje-i-klima"
  | "transmisija"
  | "vesanje-i-upravljanje"
  | "kocnice"
  | "elektrika-i-svetla"
  | "karoserija"
  | "tockovi"
  | "servis";

export type Sistem = {
  slug: SistemSlug;
  naziv: string;
  redosled: number;
  /** Jedna rečenica: kartice, footer, meta. */
  opis: string;
  /** 2–3 pasusa, 80–150 reči (K04). */
  uvod: readonly string[];
  /** Šta navesti u upitu za ovaj sistem, 3–5 stavki (K04). */
  upitSaveti: readonly string[];
  /** Meta opis, 120–160 znakova. */
  metaOpis: string;
  /** Slug grupe čiji render predstavlja sistem. */
  slika: string;
};

export type Podgrupa = { slug: string; naziv: string; kratko: string };

export type Grupa = {
  slug: string;
  naziv: string;
  sistem: SistemSlug;
  kratko: string;
  staRadi: string;
  kadaSeMenja: string;
  savet: string;
  /** Samo „Filteri“: četiri vrste filtera sa svojim renderom. */
  podgrupe?: readonly Podgrupa[];
};

export const SISTEMI: readonly Sistem[] = [
  {
    slug: "motor-i-usis",
    naziv: "Motor i usis",
    redosled: 1,
    opis: "Blok i glava motora, turbina, usis, gorivo, paljenje, kaiševi i pomoćni agregati.",
    uvod: [
      "Motor i usis je najveći sistem u asortimanu. Obuhvata blok i glavu motora, turbinu i interkuler, usisnu granu, brizgaljke i pumpu goriva, paljenje i grejače, kaiševe, alternator i anlaser, karter, EGR ventil i nosače motora.",
      "Isti model vozila VW grupe dolazi sa više motora, benzinskih i dizelskih. Delovi se razlikuju po kodu motora, a ne samo po modelu i godištu. Kod motora piše na bloku i u servisnoj knjižici, a po broju šasije proveravamo da li deo odgovara.",
      "Za veće poslove, kao što je zamena zupčastog kaiša ili turbine, navedite u upitu sve delove koje menjate u istom poslu.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Kod motora, ako ga znate: piše na bloku i u servisnoj knjižici.",
      "Koji deo vam treba ili koji kvar ima vozilo, uz kod greške iz dijagnostike.",
      "Za zupčasti kaiš: da li menjate ceo set sa vodenom pumpom i zatezačima.",
    ],
    metaOpis:
      "Delovi motora za Volkswagen, Audi, Škoda, SEAT i Cupra: turbina, brizgaljke, set zupčastog kaiša, alternator, EGR i nosači. Upit po broju šasije.",
    slika: "turbina",
  },
  {
    slug: "izduvni-sistem",
    naziv: "Izduvni sistem",
    redosled: 2,
    opis: "DPF, katalizator, lonci, cevi i delovi za montažu auspuha.",
    uvod: [
      "Izduvni sistem vodi gasove od motora do zadnjeg lonca, čisti ih i utišava. Ovde su DPF filter i katalizator, srednji i zadnji lonac, cevi, obujmice i gumeni nosači. Lambda sonde su u sistemu Elektrika i svetla.",
      "Kod dizelskih vozila posebnu pažnju traži DPF. Zapušen filter je često posledica drugog kvara, na primer EGR ventila ili senzora pritiska. Zato je dobro da pre zamene znate šta pokazuje dijagnostika. Ako lampica DPF-a stalno svetli, proverite i senzor diferencijalnog pritiska i creva do njega.",
      "Delovi izduvnog sistema zavise od motora i od norme emisije vozila. Pošaljite broj šasije i proverićemo tačan deo pre ponude. Uz lonce i cevi navedite da li vam trebaju i obujmice, zaptivke i gumeni nosači.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Koji deo menjate: DPF, katalizator, srednji ili zadnji lonac, cev.",
      "Da li vam trebaju i obujmice, zaptivke i gumeni nosači.",
      "Kod motora, ako ga znate: od njega zavise DPF i katalizator.",
      "Greške iz dijagnostike, ako ih imate (na primer pritisak DPF-a).",
    ],
    metaOpis:
      "Izduvni sistem za Volkswagen, Audi, Škoda, SEAT i Cupra: DPF filter, katalizator, lonci, cevi, obujmice i nosači. Upit po broju šasije.",
    slika: "auspuh",
  },
  {
    slug: "hladjenje-i-klima",
    naziv: "Hlađenje i klima",
    redosled: 3,
    opis: "Hladnjak, ventilator, termostat, creva hlađenja i delovi klime.",
    uvod: [
      "Sistem hlađenja drži motor na radnoj temperaturi, a klima hladi vazduh u kabini. Ovde su hladnjak i ventilator, termostat sa kućištem, creva hlađenja, kompresor, kondenzator i sušač klime.",
      "Kvar u hlađenju brzo prelazi na motor: pregrevanje može da ošteti dihtung glave. Zato hladnjak, termostat i creva treba proveriti čim se pojavi curenje ili temperatura počne da skače.",
      "Isti model može imati više izvedbi hladnjaka i kompresora, zavisno od motora, menjača i opreme. Pošaljite broj šasije i proverićemo koja izvedba odgovara vašem vozilu.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Koji deo: hladnjak motora, ventilator, termostat, crevo, kompresor, kondenzator ili sušač.",
      "Za crevo: gde se nalazi, na primer gornje ili donje crevo hladnjaka.",
      "Šta se dešava: pregrevanje, curenje ili klima koja ne hladi.",
    ],
    metaOpis:
      "Hlađenje i klima za Volkswagen, Audi, Škoda, SEAT i Cupra: hladnjak, ventilator, termostat, creva, kompresor i kondenzator klime. Upit po šasiji.",
    slika: "hladnjak-ventilator",
  },
  {
    slug: "transmisija",
    naziv: "Transmisija",
    redosled: 4,
    opis: "Kvačilo i zamajac, menjač i poluosovine sa homokinetičkim zglobovima.",
    uvod: [
      "Transmisija prenosi snagu od motora do točkova. Ovde su set kvačila sa dvomasenim zamajcem i potisnim ležajem, delovi menjača i ulja za DSG, kao i poluosovine sa homokinetičkim zglobovima i manžetnama.",
      "Vozila VW grupe imaju ručne i automatske menjače, među njima i DSG sa dvostrukim kvačilom. Delovi se razlikuju po kodu menjača, broju stepeni prenosa i motoru, pa isti model može imati više različitih setova kvačila.",
      "Pre upita proverite vrstu menjača. Za DSG navedite da li vam treba ulje, filter ili deo menjača, a za ručni menjač da li menjate ceo set kvačila sa zamajcem.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Vrsta menjača: ručni ili DSG, i broj stepeni prenosa ako ga znate.",
      "Za kvačilo: samo set kvačila ili set sa dvomasenim zamajcem.",
      "Za poluosovinu: leva ili desna strana, cela poluosovina ili samo zglob i manžetna.",
    ],
    metaOpis:
      "Transmisija za Volkswagen, Audi, Škoda, SEAT i Cupra: setovi kvačila, dvomaseni zamajci, delovi i ulja za DSG menjač, poluosovine i zglobovi.",
    slika: "kvacilo-zamajac",
  },
  {
    slug: "vesanje-i-upravljanje",
    naziv: "Vešanje i upravljanje",
    redosled: 5,
    opis: "Amortizeri, opruge, ramena, spone, stabilizatori, letva volana i ležajevi točka.",
    uvod: [
      "Vešanje drži točak na putu, a upravljanje vodi vozilo kuda okrenete volan. U ovom sistemu su amortizeri i opruge, ramena i selen blokovi, spone i štangle stabilizatora, letva volana, ležajevi točka i glavčine.",
      "Isti model može imati različito vešanje: standardno, sportsko ili prilagodljivo, uz različite nosače i stabilizatore. Razliku prave oprema i vrsta pogona: prednji ili na sva četiri točka. Zato deo proveravamo po broju šasije.",
      "Amortizere i opruge menjajte u paru na istoj osovini. Posle zamene ramena, spona ili letve volana uradite reglažu trapa.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Osovina i strana: prednja ili zadnja, leva ili desna.",
      "Vrsta vešanja, ako je znate: standardno, sportsko ili prilagodljivo.",
      "Da li menjate deo u paru i da li vam trebaju ležajevi, gumice i vijci.",
    ],
    metaOpis:
      "Vešanje i upravljanje za Volkswagen, Audi, Škoda, SEAT i Cupra: amortizeri, opruge, ramena, spone, stabilizatori, letva volana i ležajevi točka.",
    slika: "amortizeri-opruge",
  },
  {
    slug: "kocnice",
    naziv: "Kočnice",
    redosled: 6,
    opis: "Kočioni diskovi, pločice, čeljusti i ABS senzori.",
    uvod: [
      "Kočnice zaustavljaju vozilo i tu nema mesta za približan deo. Ovde su prednji i zadnji kočioni diskovi, pločice sa senzorima habanja, kočione čeljusti sa setovima za reparaciju i ABS senzori.",
      "Isti model vozila VW grupe često ima više sistema kočnica, sa različitim prečnikom diska i različitim čeljustima. Pravi deo se određuje po broju šasije, po oznaci na čeljusti ili po prečniku diska.",
      "Diskove i pločice menjajte u paru na istoj osovini. Zadnje čeljusti sa elektronskom ručnom kočnicom traže dijagnostiku da bi se klip vratio u servisni položaj.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Osovina: prednje ili zadnje kočnice.",
      "Prečnik diska ili oznaka na čeljusti, ako ih znate.",
      "Da li vam trebaju i senzor habanja pločica i pribor za montažu.",
    ],
    metaOpis:
      "Kočnice za Volkswagen, Audi, Škoda, SEAT i Cupra: kočioni diskovi, pločice, čeljusti i ABS senzori. Deo proveravamo po broju šasije pre ponude.",
    slika: "kocioni-diskovi",
  },
  {
    slug: "elektrika-i-svetla",
    naziv: "Elektrika i svetla",
    redosled: 7,
    opis: "Akumulator, farovi, stop svetla i senzori.",
    uvod: [
      "Elektrika i svetla obuhvataju akumulator, farove, stop svetla i senzore: lambda sonde, parking senzore i senzore temperature. Od njih zavise paljenje, vidljivost i podaci koje dobija računar motora. Alternator i anlaser su u sistemu Motor i usis.",
      "Kod ovih delova oprema vozila pravi najveću razliku. Halogeni, ksenon i LED farovi nisu međusobno zamenljivi, a vozila sa start-stop sistemom traže EFB ili AGM akumulator. Karavan i limuzina istog modela često imaju različita stop svetla.",
      "Zato opremu proveravamo po broju šasije pre ponude. Za senzor navedite koji je i gde se nalazi, uz kod greške iz dijagnostike ako ga imate.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Za far ili stop svetlo: leva ili desna strana i vrsta karoserije.",
      "Vrsta farova (halogeni, ksenon ili LED) i da li vozilo ima start-stop sistem.",
      "Za senzor: koji senzor i gde se nalazi, uz kod greške iz dijagnostike.",
    ],
    metaOpis:
      "Elektrika i svetla za Volkswagen, Audi, Škoda, SEAT i Cupra: akumulatori, farovi, stop svetla, lambda sonde i parking senzori. Upit po šasiji.",
    slika: "farovi",
  },
  {
    slug: "karoserija",
    naziv: "Karoserija",
    redosled: 8,
    opis: "Hauba, branici, blatobrani, vrata, retrovizori, stakla i brisači.",
    uvod: [
      "Karoserija obuhvata limarske i spoljne delove: haubu, branike sa nosačima i maskama, blatobrane i podbranike, vrata sa bravama i podizačima stakala, retrovizore, stakla i brisače.",
      "Karoserijski delovi zavise od verzije modela: hečbek, limuzina ili karavan, pre ili posle fejsliftinga. Zavise i od opreme. Branik sa otvorima za parking senzore i prskalice farova nije isti kao branik bez njih, a vetrobran sa senzorom kiše i kamerom nije isti kao osnovni.",
      "U upitu navedite stranu, položaj i opremu. Uz broj šasije to nam pomaže da proverimo tačan deo.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Strana i položaj: levo ili desno, napred ili pozadi.",
      "Oprema: parking senzori, prskalice farova, senzor kiše, kamera, grejanje retrovizora.",
      "Vrsta karoserije: hečbek, limuzina ili karavan.",
    ],
    metaOpis:
      "Karoserija za Volkswagen, Audi, Škoda, SEAT i Cupra: hauba, branici, blatobrani, vrata, retrovizori, stakla i brisači. Upit po broju šasije.",
    slika: "retrovizori",
  },
  {
    slug: "tockovi",
    naziv: "Točkovi",
    redosled: 9,
    opis: "Felne, gume i vijci točkova.",
    uvod: [
      "Gume su jedini dodir vozila sa putem, pa od točkova zavise kočenje i upravljanje. U ovom sistemu su felne, gume i vijci točkova za vozila Volkswagen, Audi, Škoda, SEAT i Cupra.",
      "Felna mora da odgovara vozilu po broju i rasporedu rupa, prečniku centralnog otvora i ofsetu (ET). Vijci točkova se razlikuju po dužini, navoju i obliku naleganja, pa vijci sa jedne felne ne moraju da odgovaraju drugoj. Čelične i aluminijumske felne često traže različite vijke. Ako vozilo ima senzore pritiska u ventilima, navedite to u upitu.",
      "Gume birajte po dimenziji, indeksu nosivosti i indeksu brzine. Podaci su na boku postojeće gume. Gume na istoj osovini treba da budu iste dimenzije i vrste. Ako niste sigurni koje felne i gume vozilo sme da ima, pošaljite broj šasije i dimenziju koju sada koristite.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Dimenzija gume sa boka (na primer 205/55 R16) i indeksi nosivosti i brzine.",
      "Za felne: prečnik, širina i ET, ako ih znate.",
      "Za vijke: koliko komada i za koje felne, čelične ili aluminijumske.",
      "Da li vozilo ima senzore pritiska u ventilima točkova.",
    ],
    metaOpis:
      "Felne, gume i vijci točkova za Volkswagen, Audi, Škoda, SEAT i Cupra. Pošaljite broj šasije: dimenziju, ET i vijke proveravamo pre ponude.",
    slika: "felne-gume",
  },
  {
    slug: "servis",
    naziv: "Servis i održavanje",
    redosled: 10,
    opis: "Filteri ulja, vazduha, goriva i kabine, ulja i tečnosti.",
    uvod: [
      "U ovom sistemu su delovi koji se menjaju redovno: filteri ulja, vazduha, goriva i kabine, motorno ulje, ulje za menjač, kočiona i rashladna tečnost.",
      "Za vozila VW grupe ulje se bira po normi proizvođača, a ne samo po viskozitetu. Norma je navedena u uputstvu za vozilo. Filteri se razlikuju po motoru, pa isti model ima više izvedbi filtera ulja i goriva.",
      "Ako radite redovan servis, pošaljite broj šasije i spisak: koji filteri, koje ulje i koje tečnosti vam trebaju. Proverićemo delove za taj motor i javiti vam ponudu.",
    ],
    upitSaveti: [
      "Broj šasije (VIN) iz saobraćajne dozvole, polje E.",
      "Kod motora, ako ga znate: od njega zavise filter ulja i filter goriva.",
      "Norma i količina ulja, ako ih znate.",
      "Šta menjate na ovom servisu: koje filtere i koje tečnosti.",
    ],
    metaOpis:
      "Servis i održavanje za Volkswagen, Audi, Škoda, SEAT i Cupra: filteri ulja, vazduha, goriva i kabine, ulja po VW normi, kočiona i rashladna tečnost.",
    slika: "filteri",
  },
];

export const GRUPE: readonly Grupa[] = [
  {
    slug: "motor",
    naziv: "Blok motora i glava",
    sistem: "motor-i-usis",
    kratko: "Glave, zaptivke glave, ventili i delovi bloka.",
    staRadi: "Blok motora i glava nose sve ostale delove motora: klipove, bregaste osovine, ventile i zaptivke.",
    kadaSeMenja: "Delovi glave i bloka traže se posle pregrevanja, pucanja dihtunga glave ili potrošnje ulja koja ne prestaje posle zamene semeringa.",
    savet: "Pre upita proverite kod motora (na bloku ili u servisnoj knjižici) — isti model ima više motora.",
  },
  {
    slug: "turbina",
    naziv: "Turbina (turbopunjač)",
    sistem: "motor-i-usis",
    kratko: "Turbine i setovi za montažu.",
    staRadi: "Turbina koristi izduvne gasove da ubaci više vazduha u motor; bez nje dizel i TSI motori gube snagu.",
    kadaSeMenja: "Zvižduk, plavi dim, ulje u interkuleru ili greška pritiska punjenja znače da turbinu treba proveriti.",
    savet: "Uz novu turbinu uvek menjajte ulje, filter ulja i dovodnu cev ulja — prljavo ulje brzo ošteti i novu turbinu.",
  },
  {
    slug: "interkuler",
    naziv: "Interkuler",
    sistem: "motor-i-usis",
    kratko: "Interkuleri, creva i obujmice.",
    staRadi: "Interkuler hladi vazduh posle turbine, pa motor dobija gušći vazduh i više snage.",
    kadaSeMenja: "Pukao interkuler ili crevo daje gubitak snage, dim i grešku niskog pritiska punjenja.",
    savet: "Ako je turbina bacala ulje, interkuler i creva operite ili zamenite pre nove turbine.",
  },
  {
    slug: "usisna-grana",
    naziv: "Usisna grana i kućište filtera",
    sistem: "motor-i-usis",
    kratko: "Usisne grane, klapne i kućišta filtera.",
    staRadi: "Usisna grana i kućište filtera vode vazduh od filtera do cilindara.",
    kadaSeMenja: "Pukla grana, zaglavljene klapne ili naprsli priključci daju neravan rad i grešku mešavine.",
    savet: "Na TDI motorima proverite i klapne usisne grane — čest uzrok greške P2015.",
  },
  {
    slug: "brizgaljke-pumpa-goriva",
    naziv: "Brizgaljke i pumpa goriva",
    sistem: "motor-i-usis",
    kratko: "Brizgaljke, pumpe visokog pritiska, podloške.",
    staRadi: "Brizgaljke i pumpa goriva doziraju gorivo pod pritiskom; od njih zavise potrošnja, snaga i dim.",
    kadaSeMenja: "Težak start, crni dim, kucanje ili greška brizgaljke znače da treba proveriti brizgaljke i pritisak goriva.",
    savet: "Kod zamene brizgaljki na TDI motoru uvek stavite nove bakarne podloške i vijke.",
  },
  {
    slug: "zupcasti-kais-vodena-pumpa",
    naziv: "Set zupčastog kaiša i vodena pumpa",
    sistem: "motor-i-usis",
    kratko: "Setovi kaiša sa vodenom pumpom i zatezačima.",
    staRadi: "Set zupčastog kaiša drži bregastu osovinu u koraku sa radilicom; vodena pumpa je obično u istom poslu.",
    kadaSeMenja: "Menja se po intervalu proizvođača ili odmah ako kaiš ima pukotine ili pumpa curi ili šumi.",
    savet: "Kaiš, zatezač, vodilice i vodenu pumpu menjajte zajedno — posao je isti, a kvar skup.",
  },
  {
    slug: "kais-alternatora",
    naziv: "Kaiš alternatora i zatezači",
    sistem: "motor-i-usis",
    kratko: "Rebrasti kaiševi, zatezači i remenice.",
    staRadi: "Kaiš alternatora pokreće alternator, kompresor klime i, zavisno od motora, druge pomoćne agregate.",
    kadaSeMenja: "Škripa na hladno, ispucali žlebovi ili zatezač koji lupa znače zamenu.",
    savet: "Uz kaiš proverite zatezač i remenicu radilice — dotrajala remenica cepa novi kaiš.",
  },
  {
    slug: "alternator",
    naziv: "Alternator",
    sistem: "motor-i-usis",
    kratko: "Alternatori, regulatori i remenice.",
    staRadi: "Alternator puni akumulator i napaja elektriku dok motor radi.",
    kadaSeMenja: "Lampica akumulatora, slabo svetlo ili prazan akumulator posle vožnje ukazuju na alternator ili regulator.",
    savet: "Pre zamene izmerite napon punjenja na polovima akumulatora: oko 14 V pri radu je ispravno.",
  },
  {
    slug: "anlaser",
    naziv: "Anlaser",
    sistem: "motor-i-usis",
    kratko: "Anlaseri i automati anlasera.",
    staRadi: "Anlaser okreće motor pri paljenju.",
    kadaSeMenja: "Klik bez okretanja, sporo okretanje ili zvuk mlevenja pri startu znače proveru anlasera.",
    savet: "Prvo proverite akumulator i masu — slab kontakt često liči na neispravan anlaser.",
  },
  {
    slug: "paljenje-grejaci",
    naziv: "Svećice, bobine i grejači",
    sistem: "motor-i-usis",
    kratko: "Svećice, bobine i grejači.",
    staRadi: "Svećice i bobine pale smešu kod benzinaca, a grejači pomažu hladan start dizela.",
    kadaSeMenja: "Preskakanje, trzanje pri ubrzanju ili težak start na hladno znače proveru paljenja ili grejača.",
    savet: "Bobine na TSI motorima menjajte po grešci konkretnog cilindra, a svećice uvek u kompletu.",
  },
  {
    slug: "karter-dihtunzi",
    naziv: "Karter, pumpa ulja i dihtunzi",
    sistem: "motor-i-usis",
    kratko: "Karteri, pumpe ulja, dihtunzi i semerinzi.",
    staRadi: "Karter drži ulje, pumpa ulja ga razvodi, a dihtunzi i semerinzi zaptivaju motor.",
    kadaSeMenja: "Curenje ulja, udaren karter ili lampica pritiska ulja traže zamenu.",
    savet: "Čep kartera ili njegovu podlošku menjajte pri svakoj zameni ulja — mala stavka koja sprečava curenje.",
  },
  {
    slug: "egr-ventil",
    naziv: "EGR ventil",
    sistem: "motor-i-usis",
    kratko: "EGR ventili, hladnjaci i zaptivke.",
    staRadi: "EGR ventil vraća deo izduvnih gasova u usis i smanjuje emisiju azotnih oksida.",
    kadaSeMenja: "Gubitak snage, dim i greške protoka EGR-a znače zaprljan ili neispravan ventil.",
    savet: "Na dizelima sa EGR hladnjakom proverite i hladnjak — curenje rashladne tečnosti je čest pratilac.",
  },
  {
    slug: "nosaci-motora",
    naziv: "Nosači motora i menjača",
    sistem: "motor-i-usis",
    kratko: "Nosači motora, menjača i obrtni nosači.",
    staRadi: "Nosači motora i menjača drže agregat i guše vibracije.",
    kadaSeMenja: "Udarci pri kretanju, vibracije u leru ili pokidana guma znače zamenu nosača.",
    savet: "Kada menjate nosač motora, proverite i nosač menjača — rade zajedno i često se troše slično.",
  },
  {
    slug: "dpf-katalizator",
    naziv: "DPF i katalizator",
    sistem: "izduvni-sistem",
    kratko: "DPF filteri, katalizatori i montažni setovi.",
    staRadi: "DPF zadržava čađ dizela, a katalizator pretvara štetne gasove u manje štetne.",
    kadaSeMenja: "Česta regeneracija, lampica DPF-a ili gubitak snage znače zapušen filter.",
    savet: "Pre zamene DPF-a proverite senzor pritiska i EGR — zapušen filter je često posledica, a ne uzrok.",
  },
  {
    slug: "auspuh",
    naziv: "Auspuh (lonci i cevi)",
    sistem: "izduvni-sistem",
    kratko: "Lonci, cevi, obujmice i gumeni nosači.",
    staRadi: "Auspuh vodi izduvne gasove i utišava motor preko srednjeg i zadnjeg lonca.",
    kadaSeMenja: "Glasniji rad, lupkanje ispod vozila ili progoreo lonac znače zamenu.",
    savet: "Uz lonce uzmite nove obujmice i gumene nosače — stari retko izdrže demontažu.",
  },
  {
    slug: "hladnjak-ventilator",
    naziv: "Hladnjak i ventilator",
    sistem: "hladjenje-i-klima",
    kratko: "Hladnjaci motora, ventilatori i poklopci.",
    staRadi: "Hladnjak i ventilator odvode toplotu iz motora.",
    kadaSeMenja: "Pregrevanje, curenje tečnosti ili ventilator koji se ne uključuje traže proveru.",
    savet: "Posle zamene hladnjaka odzračite sistem po uputstvu — vazdušni džep može da izazove pregrevanje.",
  },
  {
    slug: "termostat-creva",
    naziv: "Termostat i creva hlađenja",
    sistem: "hladjenje-i-klima",
    kratko: "Termostati, kućišta i creva hlađenja.",
    staRadi: "Termostat drži radnu temperaturu motora, a creva vode tečnost kroz sistem.",
    kadaSeMenja: "Motor se sporo zagreva, temperatura skače ili creva cure — vreme je za termostat i creva.",
    savet: "Koristite rashladnu tečnost po normi proizvođača (npr. G12 ili G13) i ne mešajte vrste.",
  },
  {
    slug: "klima",
    naziv: "Kompresor i kondenzator klime",
    sistem: "hladjenje-i-klima",
    kratko: "Kompresori, kondenzatori i sušači.",
    staRadi: "Kompresor i kondenzator klime hlade vazduh u kabini.",
    kadaSeMenja: "Klima ne hladi, kompresor ne uključuje ili se čuje zujanje — proverite punjenje i kompresor.",
    savet: "Pri zameni kompresora obavezno menjajte sušač i ispirajte sistem.",
  },
  {
    slug: "kvacilo-zamajac",
    naziv: "Kvačilo i zamajac",
    sistem: "transmisija",
    kratko: "Setovi kvačila, dvomaseni zamajci, potisni ležajevi.",
    staRadi: "Kvačilo prenosi snagu na menjač, a dvomaseni zamajac guši vibracije motora.",
    kadaSeMenja: "Proklizavanje, trzanje pri kretanju ili lupkanje u leru znače proveru kvačila i zamajca.",
    savet: "Pri zameni kvačila proverite dvomaseni zamajac; ako je zazor van tolerancije proizvođača, menjajte ga zajedno sa kvačilom.",
  },
  {
    slug: "menjac",
    naziv: "Menjač (DSG)",
    sistem: "transmisija",
    kratko: "Delovi menjača, filteri i ulja za DSG.",
    staRadi: "Menjač prenosi snagu na točkove; DSG menjači imaju mehatroniku i dvostruko kvačilo.",
    kadaSeMenja: "Trzanje, kašnjenje ubacivanja ili lampica menjača traže dijagnostiku.",
    savet: "Ulje DSG menjača menjajte po intervalu proizvođača; staro ulje je čest uzrok problema sa mehatronikom.",
  },
  {
    slug: "poluosovine",
    naziv: "Poluosovine i homokinetički zglobovi",
    sistem: "transmisija",
    kratko: "Poluosovine, zglobovi i manžetne.",
    staRadi: "Poluosovine i homokinetički zglobovi prenose snagu od menjača do točkova.",
    kadaSeMenja: "Kliktanje pri skretanju ili pocepana manžetna znače zglob ili celu poluosovinu.",
    savet: "Pocepanu manžetnu zamenite odmah — zglob bez masti i sa prljavštinom brzo propada.",
  },
  {
    slug: "amortizeri-opruge",
    naziv: "Amortizeri i opruge",
    sistem: "vesanje-i-upravljanje",
    kratko: "Amortizeri, opruge i ležajevi amortizera.",
    staRadi: "Amortizeri i opruge drže točak na putu i vozilo stabilnim u krivini.",
    kadaSeMenja: "Ljuljanje, duži put kočenja ili curenje ulja sa amortizera znače zamenu.",
    savet: "Amortizere menjajte u paru na istoj osovini, uz nove ležajeve i gumice.",
  },
  {
    slug: "ramena-selen-blokovi",
    naziv: "Ramena i selen blokovi",
    sistem: "vesanje-i-upravljanje",
    kratko: "Ramena, selen blokovi i kugle.",
    staRadi: "Ramena i selen blokovi drže geometriju točka.",
    kadaSeMenja: "Lupkanje na neravninama, povlačenje u stranu ili neravnomerno trošenje gume znače proveru.",
    savet: "Posle zamene ramena obavezno uradite reglažu trapa.",
  },
  {
    slug: "spone-stabilizatori",
    naziv: "Spone i stabilizatori",
    sistem: "vesanje-i-upravljanje",
    kratko: "Spone, krajevi spona i štangle stabilizatora.",
    staRadi: "Spone povezuju letvu volana sa točkovima, a štangle stabilizatora smanjuju naginjanje.",
    kadaSeMenja: "Zazor u volanu ili tupo lupkanje preko ležećih policajaca znače spone ili štangle.",
    savet: "Štangle stabilizatora pritežite dok je vozilo na točkovima, inače gumice brzo pucaju.",
  },
  {
    slug: "letva-volana",
    naziv: "Letva volana",
    sistem: "vesanje-i-upravljanje",
    kratko: "Letve volana i manžetne.",
    staRadi: "Letva volana pretvara okretanje volana u zakretanje točkova.",
    kadaSeMenja: "Zazor, curenje ulja ili tvrd volan traže proveru letve.",
    savet: "Kod elektromehaničke letve proverite softver i senzor momenta pre zamene.",
  },
  {
    slug: "lezaj-glavcina",
    naziv: "Ležaj točka i glavčina",
    sistem: "vesanje-i-upravljanje",
    kratko: "Ležajevi točka i glavčine.",
    staRadi: "Ležaj točka i glavčina nose točak i omogućavaju mu da se okreće bez otpora.",
    kadaSeMenja: "Brujanje koje raste sa brzinom ili zazor točka znače zamenu ležaja.",
    savet: "Glavčine sa ABS prstenom montirajte pravilno okrenute — inače ABS javlja grešku.",
  },
  {
    slug: "kocioni-diskovi",
    naziv: "Kočioni diskovi",
    sistem: "kocnice",
    kratko: "Prednji i zadnji diskovi, puni i ventilirani.",
    staRadi: "Kočioni diskovi zajedno sa pločicama pretvaraju kretanje u toplotu i zaustavljaju vozilo.",
    kadaSeMenja: "Vibracije pri kočenju, ivica na disku ili debljina ispod minimalne znače zamenu.",
    savet: "Diskove menjajte u paru i uvek sa novim pločicama; proverite prečnik diska (npr. 288 ili 312 mm).",
  },
  {
    slug: "kocione-plocice",
    naziv: "Kočione pločice",
    sistem: "kocnice",
    kratko: "Prednje i zadnje pločice, senzori habanja.",
    staRadi: "Kočione pločice pritiskaju disk i zaustavljaju vozilo.",
    kadaSeMenja: "Škripa, lampica pločica ili debljina obloge ispod minimuma proizvođača znače zamenu.",
    savet: "Proverite broj na čeljusti ili prečnik diska — isti model ima više sistema kočnica.",
  },
  {
    slug: "kocione-celjusti",
    naziv: "Kočione čeljusti",
    sistem: "kocnice",
    kratko: "Čeljusti, setovi za reparaciju i klipovi.",
    staRadi: "Kočiona čeljust pritiska pločice na disk pomoću klipa.",
    kadaSeMenja: "Vozilo vuče u stranu, disk se greje, čeljust curi ili se klip zaglavljuje — čeljust treba servis ili zamenu.",
    savet: "Zadnje čeljusti sa elektronskom ručnom kočnicom traže dijagnostiku za servisni položaj klipa.",
  },
  {
    slug: "abs-senzori",
    naziv: "ABS senzori",
    sistem: "kocnice",
    kratko: "ABS senzori prednji i zadnji.",
    staRadi: "ABS senzori mere brzinu svakog točka za ABS i ESP.",
    kadaSeMenja: "Lampice ABS i ESP ili greška jednog točka znače proveru senzora i kabla.",
    savet: "Pre zamene očistite senzor i prsten — rđa na prstenu daje istu grešku.",
  },
  {
    slug: "akumulator",
    naziv: "Akumulator",
    sistem: "elektrika-i-svetla",
    kratko: "Akumulatori, EFB i AGM.",
    staRadi: "Akumulator pokreće anlaser i čuva elektriku dok motor ne radi.",
    kadaSeMenja: "Sporo paljenje ujutru ili start-stop sistem koji više ne gasi motor znače da je akumulator slab.",
    savet: "Na vozilima sa start-stop sistemom ugradite EFB ili AGM akumulator i registrujte ga dijagnostikom.",
  },
  {
    slug: "farovi",
    naziv: "Farovi",
    sistem: "elektrika-i-svetla",
    kratko: "Farovi, sijalice i nosači.",
    staRadi: "Farovi osvetljavaju put i čine vozilo vidljivim.",
    kadaSeMenja: "Pukla ili zamućena maska fara, vlaga u faru ili polomljen nosač znače zamenu.",
    savet: "Proverite da li vozilo ima halogene, ksenon ili LED farove — nisu međusobno zamenljivi.",
  },
  {
    slug: "stop-svetla",
    naziv: "Stop svetla",
    sistem: "elektrika-i-svetla",
    kratko: "Stop svetla i nosači sijalica.",
    staRadi: "Stop svetla pokazuju kočenje i položaj vozila otpozadi.",
    kadaSeMenja: "Pukla maska ili vlaga u svetlu traže zamenu.",
    savet: "Karavan i limuzina istog modela često imaju različita stop svetla.",
  },
  {
    slug: "senzori",
    naziv: "Senzori (lambda, parking, temperatura)",
    sistem: "elektrika-i-svetla",
    kratko: "Lambda sonde, parking i temperaturni senzori.",
    staRadi: "Lambda, parking i temperaturni senzori šalju podatke računaru motora i vozaču.",
    kadaSeMenja: "Greška u memoriji, povećana potrošnja ili parking senzor koji stalno pišti znače proveru senzora.",
    savet: "Lambda sondu birajte po položaju (pre ili posle katalizatora) i broju žica.",
  },
  {
    slug: "hauba",
    naziv: "Hauba",
    sistem: "karoserija",
    kratko: "Haube i delovi za montažu.",
    staRadi: "Hauba štiti motorni prostor i deo je karoserije.",
    kadaSeMenja: "Posle udara ili korozije haubu menjate ili ispravljate.",
    savet: "Uz haubu proverite bravu, šarke i sajlu — posle udara često stradaju i one.",
  },
  {
    slug: "branici",
    naziv: "Branici",
    sistem: "karoserija",
    kratko: "Prednji i zadnji branici, nosači i maske.",
    staRadi: "Branici prvi primaju udarac i nose maske, svetla i senzore.",
    kadaSeMenja: "Pukao branik ili polomljeni nosači traže zamenu.",
    savet: "Proverite da li branik ima otvore za parking senzore i prskalice farova.",
  },
  {
    slug: "blatobrani",
    naziv: "Blatobrani",
    sistem: "karoserija",
    kratko: "Blatobrani i podbranici.",
    staRadi: "Blatobrani štite točkove i oblikuju prednji deo vozila.",
    kadaSeMenja: "Udar ili korozija na ivici luka znače zamenu.",
    savet: "Plastične podbranike menjajte zajedno sa limom ako su oštećeni.",
  },
  {
    slug: "vrata",
    naziv: "Vrata",
    sistem: "karoserija",
    kratko: "Vrata, brave i podizači stakala.",
    staRadi: "Vrata nose bravu, podizač stakla, staklo i obloge.",
    kadaSeMenja: "Vrata se menjaju ili repariraju posle udara ili korozije na donjem delu.",
    savet: "Podizači stakla dolaze kao levi ili desni, prednji ili zadnji — navedite stranu i položaj u upitu.",
  },
  {
    slug: "retrovizori",
    naziv: "Retrovizori",
    sistem: "karoserija",
    kratko: "Retrovizori, stakla i kućišta.",
    staRadi: "Retrovizori daju pogled unazad; savremeni imaju grejanje, žmigavac i električno sklapanje.",
    kadaSeMenja: "Polomljeno kućište ili staklo traže zamenu dela ili celog retrovizora.",
    savet: "Proverite broj pinova konektora — opcije retrovizora se razlikuju po opremi.",
  },
  {
    slug: "stakla",
    naziv: "Stakla",
    sistem: "karoserija",
    kratko: "Vetrobrani, zadnja i bočna stakla.",
    staRadi: "Stakla štite putnike i nose senzore kiše i kamere.",
    kadaSeMenja: "Pukotina u vidnom polju vozača znači zamenu vetrobrana.",
    savet: "Vetrobrani se razlikuju po nosaču senzora kiše i kamere — navedite opremu u upitu.",
  },
  {
    slug: "brisaci",
    naziv: "Brisači",
    sistem: "karoserija",
    kratko: "Metlice brisača i motori brisača.",
    staRadi: "Brisači čiste staklo i daju vidljivost po kiši.",
    kadaSeMenja: "Tragovi, škripa ili preskakanje metlica znače zamenu.",
    savet: "Metlice menjajte u paru i proverite tip nosača (kuka ili pin).",
  },
  {
    slug: "felne-gume",
    naziv: "Felne i gume",
    sistem: "tockovi",
    kratko: "Felne, gume i vijci točkova.",
    staRadi: "Gume su jedini dodir vozila sa putem, a felna nosi gumu i vezuje točak za glavčinu.",
    kadaSeMenja: "Menjaju se kada dubina šare padne ispod zakonskog minimuma, kada guma ostari ili joj je bok oštećen.",
    savet: "Dimenziju i indekse proverite na boku postojeće gume, a ET na felni.",
  },
  {
    slug: "filteri",
    naziv: "Filteri",
    sistem: "servis",
    kratko: "Filteri ulja, vazduha, goriva i kabine.",
    staRadi: "Filteri čuvaju motor i kabinu od prljavštine: ulje, vazduh, gorivo i vazduh za kabinu.",
    kadaSeMenja: "Filter ulja se menja na svakom servisu, a ostali po intervalu proizvođača; filter goriva dizela i ranije ako motor trokira.",
    savet: "Filter ulja menjajte pri svakoj zameni ulja, a filter goriva po preporuci za motor.",
    podgrupe: [
      { slug: "filter-ulja", naziv: "Filter ulja", kratko: "Filteri ulja i ulošci." },
      { slug: "filter-vazduha", naziv: "Filter vazduha", kratko: "Filteri vazduha motora." },
      { slug: "filter-goriva", naziv: "Filter goriva", kratko: "Filteri goriva za dizel i benzin." },
      { slug: "filter-kabine", naziv: "Filter kabine", kratko: "Filteri kabine i sa aktivnim ugljem." },
    ],
  },
  {
    slug: "ulja-tecnosti",
    naziv: "Ulja i tečnosti",
    sistem: "servis",
    kratko: "Motorna ulja, ulja za menjač, kočiona i rashladna tečnost.",
    staRadi: "Ulja i tečnosti podmazuju, hlade i prenose pritisak u motoru, menjaču i kočnicama.",
    kadaSeMenja: "Ulje motora menjate po servisnom intervalu, a kočionu tečnost po intervalu proizvođača, jer vremenom upija vlagu.",
    savet: "Birajte ulje po VW normi (npr. 504 00/507 00), ne samo po viskozitetu.",
  },
];
