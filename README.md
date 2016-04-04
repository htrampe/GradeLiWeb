#GradeLiWeb Ver. 1.1

###GradeLiWeb ist eine webbasierte Online/Offline Schülerverwaltung. Die Software läuft mit einem PHP/MySQL-Server auf jedem Gerät (PC/Notebook/Tablet/Smartphone) und ersetzt das Klassenbuch vollständig. Zudem können Installation Synchronisiert werden.

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

##Bei Problemen/Fragen/Anregungen/Funkionswünschen: mail@holgertrampe.de oder hier auf GitHub##

Viel Spaß mit GradeLiWeb!