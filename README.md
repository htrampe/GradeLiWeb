*GradeLiWeb*


GradeLiWeb ist eine webbasierte Online/Offline Schülerverwaltung. Die Software läuft mit einem PHP/MySQL-Server auf jedem Gerät (PC/Notebook/Tablet/Smartphone) und ersetzt das Klassenbuch vollständig. Zudem können Installationen Synchronisiert werden.

**Aktuelles**
Die Entwicklung für PHP7 bzgl. neuer Verschlüsselungsfunktionen steht noch an. Bis dahin werden alle Passwörter für CalDav und Backup sowie die Backups an sich als Klartext gespeichert.

*GradeLiWeb Ver. 1.5.3*
* Synchronisation mit entferntem CalDav
* Diverse Bugs wurden entfernt
* Backupmöglichkeit wurde verbessert
* Update-Logik verbessert

Die Entwicklung von GradeLiWeb wird weitergehen, jedoch langsam xD. Aktuell arbeite ich an einer neuen Verschlüsselung, da mit PHP7 einige Änderungen vorgenommen wurden.

**Zielgruppe**

GradeLiWeb ist für alle geeignet, die in Schulen/Bildungseinrichtungen arbeiten und keine Scheu davor haben, lokal auf dem eigenen PC eine Serversoftware (z.B. XAMPP) zu nutzen.

**Voraussetzungen**

* PHP-Server 7+
* MySQL-Server
* Windows/Linux/Mac OS/Android/iOS

**Funktionen**

* Jahresplanung inkl. Kalenderansicht
* Schulstundenplanung sowie Anwesenheitsliste/Mitarbeitsnotiz/Verspätung und Stundenotiz
* Ferien und Feiertagsgenerierung (automatisch)
* Notenprogramm inkl. zwei Standardkategorien (mündlich/schriftlich) und der Möglichkeit, weitere Unterkategorien zu erstellen (Gewichtung und Anzahl der Noten variabel)
* Schülerverwaltung (Name/Vorname, Informationen und Foto)
* Synchronisation mit einer entfernen GradeLiWeb-Installation
* Backup aller Daten mit einem Klick

**Installation**

1. XAMPP oder vergleichbares auf dem Computer installieren und aktivieren.
2. Repository in das Web-Verzeichnis clonen oder ZIP-Datei herunterladen und in das htdocs-Verzeichnis entpacken.
3. Neue Datenbank im MySQL-Server anlegen und Datenbanknamen merken.
4. Die Datei "gradeliweb_START.sql" in die eben angelegte Datenbank importieren.
5. Die Datenbank-Informationen in der Datei "gw-config.php" anpassen (Auf Schreibrechte achten!).

Optional: Den aktuellen Nutzer in die httpd.conf-Datei unter User und Group eintragen, damit die Passwortdateien nicht extern geladen werden können. Ansonsten können die Zugriffsrechte der gw-config.php und des Backup-Ordners geändert werden. Hier sollte jedoch sichergestellt sein, dass der Server von außen nicht erreichbar ist, was nur bei einer lokalen Installation der Fall ist. Die ***gw-config.php*** enthält alle Datenbankinformationen und darf daher auf keinen Fall an Dritte weitergeleitet werden oder Dritte dürfen Zugriff erhalten. Hierfür ist der Nutzer selbst verantwortlich!

Fertig - danach solle GradeLiWeb mit allen Funktionen im Webverzeichnis zur Verfügung stehen.

**Update**

Um GradeLiWeb auf eine aktuelle Version zu aktualisieren muss lediglich der Ordner "core" von Github kopiert und auf dem eigenen PC ersetzt werden. Alle anderen Ordner oder Dateien müssen nicht verändert werden. Dieser Vorgang ist auch unter Einstellungen anzustoßen.

**Passwort zurücksetzen**

In der Datenbank/Tabelle "users" / Passwort beim Benutzer diese Zeichenkette kopieren: ab18961bf3f86992a4ebff424508b9d0

**Neues Passwort: leeres (das Wort ausschreiben)**

**Hinweise**

Achtung! GradeLiWeb wurde nur für Google Chrome entwickelt und ist mit keinem anderen Browser kompatibel!

GradeLiWeb kann lokal oder online (Datenschutz der Schulen beachten) betrieben werden. In jedem Fall sollte immer darauf geachtet werden, Notebooks und andere Geräte nie ungesperrt offen liegen zu lassen oder Passwörter an Dritte weiterzugeben.

Lizenz: GradeLiWeb ist kostenlos unter GNU 3.0 veröffentlicht. Jeder kann gern mit am Code schreiben und weitere Funktionen hinzufügen. Da diverse Zusatzpakete genutzt werden fallen diese unter ihre eigenen Lizenzbestimmungen. Bitte beachten!
