/* ==========================================================
   Guida Florence RP Bot
   ========================================================== */
window.GUIDE = {
  title: 'Florence RP Bot',
  groups: [
    {
      title: 'Florence RP Bot',
      items: [
        { t: 'Informazioni', p: 'generale/informazioni.html', i: 'fa-circle-info', ready: true },
        { t: 'Database', p: 'generale/database.html', i: 'fa-cloud', ready: true },
        { t: 'Changelog', p: 'generale/changelog.html', i: 'fa-globe', ready: true },
        {
          t: 'V2', p: 'generale/v2.html', i: 'fa-wand-magic-sparkles', ready: true,
          children: [{ t: 'FQA V2', p: 'generale/v2/fqa-v2.html', ready: true }]
        }
      ]
    },
    {
      title: 'Bot',
      items: [
        {
          t: 'Florence Roleplay', p: 'bot/florence-roleplay.html', i: 'fa-face-smile', ready: true,
          children: [
            { t: 'Economia', p: 'bot/florence-roleplay/economia.html', ready: true },
            { t: 'Stipendi', p: 'bot/florence-roleplay/stipendi.html', ready: true },
            { t: 'Cittadinanza', p: 'bot/florence-roleplay/cittadinanza.html', ready: true },
            { t: "Porto d'Armi", p: 'bot/florence-roleplay/porto-darmi.html', ready: true }
          ]
        },
        {
          t: 'Florence Moderations', p: 'bot/florence-moderations.html', i: 'fa-paint-roller', ready: true,
          children: [
            {
              t: 'Sistema Ticket', p: 'bot/florence-moderations/sistema-ticket.html', ready: true,
              children: [
                { t: 'Transcript', p: 'bot/florence-moderations/sistema-ticket/transcript.html', ready: true }
              ]
            }
          ]
        },
        { t: 'DB FdO', p: 'bot/db-fdo.html', i: 'fa-key', ready: true },
        { t: 'Criminalità', p: 'bot/criminalita.html', i: 'fa-gun', ready: true },
        {
          t: 'Appelli Ban', p: 'bot/appelli-ban.html', i: 'fa-gavel', ready: true,
          children: [{ t: 'Politiche Ban Appel', p: 'bot/appelli-ban/politiche-ban-appel.html', ready: true }]
        }
      ]
    },
    {
      title: 'Sezione Legale',
      items: [
        { t: 'Informazioni', p: 'sezione-legale/informazioni.html', i: 'fa-user-tie', ready: true },
        { t: 'Informativa sui Bot', p: 'sezione-legale/informativa-sui-bot.html', i: 'fa-image-portrait', ready: true },
        { t: 'Dati', p: 'sezione-legale/dati.html', i: 'fa-video', ready: true }
      ]
    },
    {
      title: 'Parte Finale',
      items: [
        { t: 'Informazioni generali', p: 'parte-finale/informazioni-generali.html', i: 'fa-book-open', ready: true },
        { t: 'Ringraziamenti', p: 'parte-finale/ringraziamenti.html', i: 'fa-heart', ready: true },
        { t: 'Link Esterni', p: 'parte-finale/link-esterni.html', i: 'fa-link', ready: true }
      ]
    }
  ]
};