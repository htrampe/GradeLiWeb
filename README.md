#GradeLiWeb Ver. 1.5.3

Seit Version 1.1 sind folgende Funktionen dazugekommen:
* Synchronisation mit entferntem CalDav und Google-Calendar
* Diverse Bugs wurden entfernt
* Backupmöglichkeit wurde verbessert
* Achtung: Der MySQL-Synch funktioniert nicht mehr korrekt!
* Update-Logik verbessert

Die Entwicklung von GradeLiWeb wird von meiner Seite her eingestellt, da ich mich auf ein anderes Projekt konzentriere, welches leichter zu installieren und auf mehr Geräten läuft (www.classnotes.de). Daher stelle ich den aktuellen Code hier ein.

Keine Garantie für Funktionen o.ä. - alles auf eigene Gefahr.

##Infos für Mit-Programmierer:

GradeLiWeb ist nach dem MVC-Pattern geschrieben und hat als Basis Bootstrap und Angular. Die Datei "app.js" im core-Verzeichnis steuert alle Vorgänge. Im Ordner views finden sich die verschiedenen HTML-Files für den Browser, welche über die Controller verwaltet werden (welche was machen wird aus der app.js ersichtlich). Im Ordner app/controllers befinden sich die JavaScript-Controller, die alle Funktionen für die jeweiligen Seiten bereitstellen. Im Ordner app/endpoint finden sich die PHP-Files, die letztlich die MySQL-Datenbank anbinden und steuern. Hier wäre sicher ein Wrapper sinnvoll - in der Entwicklung wurde das nicht gemacht.

##Wichtig

Ich bin kein professioneller Programmierer! Einige Lösungen sind Quick-and-Dirty und auch die Kommentare lassen zu wünschen übrig. Wenn jemand das Projekt dennoch weiterentwickeln will und Fragen hat, stehe ich jederzeit zur Verfügung. 

#GradeLiWeb Ver. 1.1

####GradeLiWeb ist eine webbasierte Online/Offline Schülerverwaltung. Die Software läuft mit einem PHP/MySQL-Server auf jedem Gerät (PC/Notebook/Tablet/Smartphone) und ersetzt das Klassenbuch vollständig. Zudem können Installationen Synchronisiert werden.####

##Zielgruppe

GradeLiWeb ist für alle geeignet, die in Schulen/Bildungseinrichtungen arbeiten und keine Scheu davor haben, lokal auf dem eigenen PC eine Serversoftware (z.B. XAMPP) zu nutzen.

##Voraussetzungen

* PHP-Server 5+
* MySQL-Server
* Windows/Linux/Mac OS/Android/iOS/Windows Phone (Serversoftware vorausgesetzt - für alle OS verfügbar)

##Funktionen

* Jahresplanung inkl. Kalenderansicht
* Schulstundenplanung sowie Anwesenheitsliste/Mitarbeitsnotiz/Verspätung und Stundenotiz
* Ferien und Feiertagsgenerierung (automatisch)
* Notenprogramm inkl. zwei Standardkategorien (mündlich/schriftlich) und der Möglichkeit, weitere Unterkategorien zu erstellen (Gewichtung und Anzahl der Noten variabel)
* Schülerverwaltung (Name/Vorname, Informationen und Foto)
* Synchronisation mit einer entfernen GradeLiWeb-Installation
* Backup aller Daten mit einem Klick

##Installation

1. XAMPP oder vergleichbares auf dem Computer installieren und aktivieren.
2. Repository in das Web-Verzeichnis clonen oder ZIP-Datei herunterladen und in das htdocs-Verzeichnis entpacken.
3. Neue Datenbank im MySQL-Server anlegen und Datenbanknamen merken.
4. Die Datei "gradeliweb_START.sql" in die eben angelegte Datenbank importieren.
5. Die Datenbank-Informationen in der Datei "gw-config.php" anpassen (Auf Schreibrechte achten!).

Optional: Den aktuellen Nutzer in die httpd.conf-Datei unter User und Group eintragen, damit die Passwortdateien nicht extern geladen werden können. Ansonsten können die Zugriffsrechte der gw-config.php und des Backup-Ordners geändert werden. Hier sollte jedoch sichergestellt sein, dass der Server von außen nicht erreichbar ist, was nur bei einer lokalen Installation der Fall ist. Die ***gw-config.php*** enthält alle Datenbankinformationen und darf daher auf keinen Fall an Dritte weitergeleitet werden oder Dritte dürfen Zugriff erhalten. Hierfür ist der Nutzer selbst verantwortlich!

Fertig - danach solle GradeLiWeb mit allen Funktionen im Webverzeichnis zur Verfügung stehen.

##Update

Um GradeLiWeb auf eine aktuelle Version zu aktualisieren muss lediglich der Ordner "core" von Github kopiert und auf dem eigenen PC ersetzt werden. Alle anderen Ordner oder Dateien müssen nicht verändert werden.

##Passwort zurücksetzen

In der Datenbank/Tabelle "users" / Passwort beim Benutzer diese Zeichenkette kopieren: ab18961bf3f86992a4ebff424508b9d0

**Neues Passwort: leeres (das Wort ausschreiben)**

##Hinweise

***Achtung! GradeLiWeb wurde nur für Google Chrome entwickelt und ist mit keinem anderen Browser kompatibel!***

**Hinweis:** GradeLiWeb kann lokal oder online (Datenschutz der Schulen beachten) betrieben werden. In jedem Fall sollte immer darauf geachtet werden, Notebooks und andere Geräte nie ungesperrt offen liegen zu lassen oder Passwörter an Dritte weiterzugeben.

Lizenz: GradeLiWeb ist kostenlos unter GNU 3.0 veröffentlicht. Jeder kann gern mit am Code schreiben und weitere Funktionen hinzufügen. Da diverse Zusatzpakete genutzt werden fallen diese unter ihre eigenen Lizenzbestimmungen. Bitte beachten!

####Bei Problemen/Fragen/Anregungen/Funkionswünschen: mail@holgertrampe.de oder hier auf GitHub####

Viel Spaß mit GradeLiWeb!