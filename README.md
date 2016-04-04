#GradeLiWeb Ver. 1.1

##GradeLiWeb ist eine webbasierte Online/Offline Schülerverwaltung

##Zielgruppe

GradeLiWeb ist für alle geeignet, die in Schulen/Bildungseinrichtungen arbeiten und keine Scheu davor haben, lokal auf ihrem PC eine eigene Datenbank (z.B. mit XAMPP) zu betreiben.

##Voraussetzungen

*PHP-Server 5+
*MySQL-Server
*Windows/Linux/Mac OS/Android/iOS/Windows Phone (Serversoftware voraussgesetzt)

##Funktionen

*Jahresplanung inkl. Kalenderansicht
*Schulstundenplanung sowie Anwesenheitsliste/Mitarbeitsnotiz/Verspätung und Stundenotiz (**GradeLiWeb ersetzt vollständig das Klassenbuch**)
*Ferien und Feiertagsgenerierung (automatisch)
*Notenprogramm inkl. zwei Standardkategorien (mündlich/schriftlich) und der Möglichkeit, weitere Unterkategorien zu erstellen (Gewichtung und Anzahl der Noten variabel)
*Schülerverwaltung (Name/Vorname, Informationen und Foto)
*Synchronisation mit einer entfernen GradeLiWeb-Installation (man kann also mehrere Installationen gegeneinander spiegeln und damit auf dem Tablet und Computer arbeiten - Serversoftware gibt es für Andoid und IOS)
*Backup aller Daten mit einem Klick

##Installation

1. XAMPP oder Vergleichbares auf dem Computer installieren und aktivieren.
2. Repository in das Web-Verzeichnis clonen oder ZIP-Datei herunterladen und in htdocs entpacken.
3. Datenbank anlegen und Zugangsdaten merken.
4. Die Datei "gradeliweb_START.sql" in die eben angelegte Datenbank importieren.
5. Die Datenbank-Informationen in der Datei "gw-config.php" anpassen (Auf Schreibrechte achten!).

Fertig - danach solle GradeLiWeb mit allen Funktionen im Webverzeichnis zur Verfügung stehen.

##Update

Um GradeLiWeb auf eine aktuelle Version zu aktulisieren, muss lediglich der Ordner "core" von Github kopiert und auf dem eigenen PC ersetzt werden. Alle anderen Ordner oder Dateien müssen nicht verändert werden.

***Achtung! GradeLiWeb wurde nur für Google Chrome entwickelt und ist mit keinem anderen Browser zu 100% kompatibel!***

**Hinweis:** GradeLiWeb kann lokal oder online (Datenschutz der Schulen beachten) betrieben werden. In jedem Fall sollten man immer darauf achten, Notebooks und andere Geräte nie ungesperrt offen liegen zu lassen oder unverschlüsselt Webseiten aufrufen!

Lizenz: GradeLiWeb ist kostenlos unter GNU 3.0 veröffentlicht. Jeder kann gern mit am Code schreiben und weitere Funktionen hinzufügen. Da diverse Zusatzpakete genutzt werden fallen diese unter ihre eigenen Lizenzbestimmungen. Bitte beachten!

Bei Problemen/Fragen/Anregungen: mail@holgertrampe.de

Viel Spaß mit GradeLiWeb!

##Passwort zurücksetzen

In der Datenbank/Tabelle "users" / Passwort beim Benutzer diese Zeichenkette kopieren: ab18961bf3f86992a4ebff424508b9d0

**Neues Passwort: leeres (das Wort ausschreiben)**
