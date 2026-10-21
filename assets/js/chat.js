/* LuxDocs – Chat-Assistent (Ablauf und Texte unverändert von luxdocs.de übernommen) */
(function () {
  var open = false;
  var selectedKat = '';
  var win = document.getElementById('ld-chat-window');
  var bubble = document.getElementById('ld-chat-bubble');
  var msgs = document.getElementById('ld-chat-msgs');
  var inp = document.getElementById('ld-inp');
  var ia = document.getElementById('ld-input-area');

  var KI = {
    'Allgemeine Beratung': 'Schön, dass Sie sich für ein allgemeines Beratungsgespräch interessieren. Wir nehmen uns dafür bewusst ausführlich Zeit für Sie und Ihre Situation. Die individuelle Beratung und ärztliche Auseinandersetzung mit Ihrem Anliegen ist mit Kosten verbunden, die sich nach dem tatsächlichen Aufwand richten. Der erste Termin findet persönlich in der Praxis statt.',
    'Medizinisches Cannabis': 'Danke für Ihr Vertrauen bei diesem Thema. Zur Cannabistherapie möchten wir Ihnen mitgeben: Die Erstvorstellung findet grundsätzlich persönlich vor Ort statt, nicht per Video. Ob eine Cannabistherapie für Sie infrage kommt, entscheidet sich erst nach einer ausführlichen, sorgfältigen ärztlichen Prüfung – ein Rezept ist zu keinem Zeitpunkt garantiert. Bei einer laufenden Therapie ist mindestens einmal pro Quartal ein persönlicher Termin bei uns wichtig; Folgetermine dazwischen können gerne per Video stattfinden. Auch hier gilt: Die Beratung ist mit individuellen Kosten verbunden, die sich nach dem jeweiligen Aufwand richten.',
    'Hormonelle Themen': 'Schön, dass Sie sich mit diesem Thema an uns wenden. Bei hormonellen Anliegen wie Testosteronmangel oder in der Prämenopause besprechen wir zunächst gemeinsam Ihre Symptome und veranlassen bei Bedarf eine gezielte Blutuntersuchung, die extern durchgeführt wird. Die Besprechung der Ergebnisse kann gerne auch per Video erfolgen. Auch hier gilt: Die individuelle Beratung ist mit Kosten verbunden, die vom jeweiligen Aufwand abhängen; Laborkosten fallen zusätzlich separat an.',
    'Chronische Schmerzen': 'Wir freuen uns, dass Sie uns Ihr Anliegen anvertrauen möchten. Bei chronischen Schmerzen betrachten wir Ihre Beschwerden gerne im Gesamtzusammenhang – Ihre Vorgeschichte, Ihre Lebensumstände und bisherige Behandlungen fließen mit ein. Der erste Termin findet persönlich statt, Verlaufstermine sind danach auch per Video möglich. Die individuelle Beratung ist mit Kosten verbunden, die sich nach dem Aufwand richten.',
    'Blutuntersuchung': 'Gerne unterstützen wir Sie dabei. Wir besprechen zunächst Ihre Symptome und stellen bei Bedarf einen Laborzettel für eine externe Blutabnahme aus. Die Besprechung der Ergebnisse erfolgt in einem Folgetermin, auch per Video möglich. Die Beratung ist mit individuellen Kosten verbunden; die Laborkosten selbst fallen separat an und werden meist direkt beim Labor beglichen.',
    'Gutachten': 'Gerne erstellen wir für Sie eine schriftliche gutachtliche Stellungnahme. Der Umfang und damit auch die Kosten richten sich nach der individuellen Fragestellung – das besprechen wir vorab transparent mit Ihnen.'
  };

  function toggle() {
    open = !open;
    win.classList.toggle('ld-open', open);
    win.inert = !open;
    bubble.setAttribute('aria-expanded', open);
    if (open && msgs.children.length === 0) setTimeout(step1, 350);
    if (open) win.querySelector('#ld-chat-close').focus({ preventScroll: true });
  }
  window.ldToggle = toggle;
  bubble.addEventListener('click', toggle);
  document.getElementById('ld-chat-close').addEventListener('click', function () { toggle(); bubble.focus(); });
  document.getElementById('ld-send').addEventListener('click', function () { window.ldSend(); });
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') window.ldSend(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open && !document.querySelector('.modal.open')) { toggle(); bubble.focus(); }
  });

  function step1() {
    ia.style.display = 'none';
    bot('Herzlich willkommen bei Praxis LuxDocs! Schön, dass Sie den Weg zu uns gefunden haben. Ich begleite Sie in ein paar kurzen, entspannten Schritten durch die wichtigsten Infos, bevor Sie einen Termin buchen oder uns kontaktieren – das dauert nur ein bis zwei Minuten.');
    setTimeout(function () {
      btns([{ l: 'Los geht\'s', p: true, fn: function () { rmBtns(); step2(); } }]);
    }, 600);
  }

  function step2() {
    bot('Bevor wir loslegen, kurz eine wichtige Frage: Handelt es sich bei Ihrem Anliegen um einen akuten medizinischen Notfall?');
    btns([
      { l: 'Nein', p: true, fn: function () { rmBtns(); user('Nein'); step3(); } },
      { l: 'Ja – Notfall', fn: function () {
        rmBtns(); user('Ja');
        bot('Bitte wenden Sie sich in diesem Fall umgehend an den Notruf (112) oder die nächste Notaufnahme. Unsere Praxis ist auf geplante Beratungstermine ausgerichtet und leider nicht für die Akutversorgung geeignet. Wir wünschen Ihnen von Herzen alles Gute!');
      } }
    ]);
  }

  function step3() {
    setTimeout(function () {
      bot('Schön, dann erzähle ich Ihnen kurz, wer wir sind und wie wir arbeiten:');
      setTimeout(function () {
        var d = document.createElement('div'); d.className = 'ld-m b';
        [
          'Wir sind eine Privatpraxis – die Behandlung wird nicht über die gesetzliche Krankenkasse abgerechnet, sondern privat in Rechnung gestellt (auch bei privater Krankenversicherung reichen Sie die Rechnung im Nachhinein selbst ein).',
          'Uns ist Zeit für Sie wichtig: Wir arbeiten gesprächsorientiert, ohne Apparate, Spritzen oder klassische Diagnostik – im Mittelpunkt steht das ausführliche ärztliche Gespräch.',
          'Wir verbinden fundierte Schulmedizin mit einer ganzheitlichen Perspektive – ehrlich und ohne Heilversprechen.'
        ].forEach(function (it) {
          var p = document.createElement('p');
          p.textContent = '• ' + it;
          d.appendChild(p);
        });
        msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
        setTimeout(function () {
          btns([{ l: 'Alles klar, weiter', p: true, fn: function () { rmBtns(); step4(); } }]);
        }, 400);
      }, 500);
    }, 400);
  }

  function step4() {
    bot('Eine kurze organisatorische Frage: Sind Sie mindestens 18 Jahre alt?');
    btns([
      { l: 'Ja', p: true, fn: function () { rmBtns(); user('Ja'); step5(); } },
      { l: 'Nein', fn: function () {
        rmBtns(); user('Nein');
        bot('Vielen Dank für Ihr Verständnis: Unsere Praxis richtet sich ausschließlich an volljährige Patientinnen und Patienten. Wir empfehlen Ihnen, sich an eine kinder- und jugendmedizinische Praxis zu wenden. Alles Gute für Sie!');
      } }
    ]);
  }

  function step5() {
    setTimeout(function () {
      bot('Jetzt würde ich gerne von Ihnen wissen: Worum geht es bei Ihrem Anliegen? Wählen Sie einfach die passende Kategorie – Sie bekommen direkt im Anschluss die wichtigsten Infos dazu.');
      setTimeout(function () {
        function kat(label, key) {
          return { l: label, fn: function () { rmBtns(); user(key); selectedKat = key; showInfo(); } };
        }
        btns([
          kat('Allgemeine Beratung', 'Allgemeine Beratung'),
          kat('Medizinisches Cannabis', 'Medizinisches Cannabis'),
          kat('Hormonelle Themen / Testosteron / Wechseljahre', 'Hormonelle Themen'),
          kat('Chronische Schmerzen', 'Chronische Schmerzen'),
          kat('Blutuntersuchung', 'Blutuntersuchung'),
          kat('Gutachten', 'Gutachten'),
          { l: 'Sonstiges', fn: function () { rmBtns(); user('Sonstiges'); selectedKat = 'Sonstiges'; showSonstiges(); } }
        ]);
      }, 400);
    }, 400);
  }

  function showInfo() {
    setTimeout(function () {
      bot(KI[selectedKat]);
      setTimeout(function () {
        btns([{ l: 'Verstanden, weiter', p: true, fn: function () { rmBtns(); step6(); } }]);
      }, 500);
    }, 400);
  }

  function showSonstiges() {
    setTimeout(function () {
      bot('Kein Problem – schildern Sie uns Ihr Anliegen gerne kurz in eigenen Worten. Wir melden uns bei Ihnen mit den passenden Informationen.');
      ia.style.display = 'flex'; inp.focus();
      window.ldSend = function () {
        var v = inp.value.trim(); if (!v) return;
        user(v); inp.value = ''; ia.style.display = 'none';
        window.ldSend = noop;
        setTimeout(function () {
          bot('Vielen Dank! Wir werden uns bei Ihnen melden. Wie möchten Sie fortfahren?');
          setTimeout(step8, 500);
        }, 400);
      };
    }, 400);
  }

  function step6() {
    setTimeout(function () {
      bot('Wie darf der Termin für Sie stattfinden – lieber persönlich vor Ort oder als Videosprechstunde?');
      btns([
        { l: 'Vor Ort', p: true, fn: function () { rmBtns(); user('Vor Ort'); step7(); } },
        { l: 'Videosprechstunde', fn: function () {
          rmBtns(); user('Videosprechstunde');
          if (selectedKat !== 'Gutachten') {
            setTimeout(function () {
              bot('Für Ihr Anliegen möchten wir Sie beim ersten Termin gerne persönlich in der Praxis kennenlernen – das dient Ihrer Sicherheit und einer sorgfältigen ersten Einschätzung. Videotermine sind wunderbar ab dem Folgetermin möglich.');
              setTimeout(function () {
                btns([{ l: 'Alles klar, weiter', p: true, fn: function () { rmBtns(); step7(); } }]);
              }, 400);
            }, 400);
          } else { step7(); }
        } }
      ]);
    }, 400);
  }

  function step7() {
    setTimeout(function () {
      bot('Noch ein wichtiger Hinweis, damit Sie gut vorbereitet zu uns kommen: Nach Ihrer Terminbuchung erhalten Sie elektronisch die wichtigsten Unterlagen – darunter Honorarvereinbarung, Datenschutzinformationen und Aufklärung zur Abrechnung nach GOÄ. Falls Sie diese lieber vor Ort erhalten möchten, legen wir sie Ihnen selbstverständlich direkt vor dem Termin vor. Die Bezahlung erfolgt nach dem Termin per Rechnung – bequem per Überweisung oder vor Ort per Karte.');
      setTimeout(function () {
        btns([{ l: 'Verstanden, weiter', p: true, fn: function () { rmBtns(); step8(); } }]);
      }, 400);
    }, 400);
  }

  function step8() {
    setTimeout(function () {
      bot('Ganz herzlichen Dank, dass Sie sich die Zeit genommen haben und wir Sie ein Stück kennenlernen durften! Jetzt haben Sie zwei Möglichkeiten:');
      setTimeout(function () {
        var r = document.createElement('div');
        r.className = 'ld-row';
        r.style.cssText = 'flex-direction:column;align-self:stretch;';

        var ja = document.createElement('button');
        ja.className = 'ld-b p';
        ja.textContent = 'Termin direkt über Jameda buchen';
        ja.onclick = function () { toggle(); window.ldOpenModal('booking'); };
        r.appendChild(ja);

        var disc = document.createElement('p');
        disc.className = 'ld-note';
        disc.textContent = 'Über WhatsApp klären wir gerne organisatorische Fragen (z. B. Terminverfügbarkeit, allgemeine Abläufe). Medizinische Anliegen, Symptome oder Rezeptfragen besprechen wir ausschließlich im persönlichen Gespräch oder in der Videosprechstunde.';
        r.appendChild(disc);

        var wab = document.createElement('button');
        wab.className = 'ld-b';
        wab.textContent = 'Organisatorische Frage per WhatsApp';
        wab.onclick = function () { toggle(); window.ldOpenModal('whatsapp'); };
        r.appendChild(wab);

        var thanks = document.createElement('p');
        thanks.className = 'ld-thanks';
        thanks.textContent = 'Wir freuen uns darauf, Sie kennenzulernen!';
        r.appendChild(thanks);

        msgs.appendChild(r); msgs.scrollTop = msgs.scrollHeight;
      }, 500);
    }, 400);
  }

  function noop() {}
  window.ldSend = noop;

  function bot(t) { var d = document.createElement('div'); d.className = 'ld-m b'; d.textContent = t; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  function user(t) { var d = document.createElement('div'); d.className = 'ld-m u'; d.textContent = t; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  function btns(arr) {
    var r = document.createElement('div'); r.className = 'ld-row';
    arr.forEach(function (b) {
      var btn = document.createElement('button');
      btn.className = 'ld-b' + (b.p ? ' p' : '');
      btn.textContent = b.l; btn.onclick = b.fn; r.appendChild(btn);
    });
    msgs.appendChild(r); msgs.scrollTop = msgs.scrollHeight;
  }
  function rmBtns() { msgs.querySelectorAll('.ld-row').forEach(function (r) { r.remove(); }); }
})();
