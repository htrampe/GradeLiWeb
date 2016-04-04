-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 08. Mrz 2016 um 15:56
-- Server-Version: 10.1.9-MariaDB
-- PHP-Version: 7.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;


--
-- Datenbank: `gradeliweb`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cats`
--

CREATE TABLE `cats` (
  `id` int(11) NOT NULL,
  `classes_id` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `ocat` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `classdates`
--

CREATE TABLE `classdates` (
  `id` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `c_short` varchar(200) DEFAULT NULL,
  `c_long` varchar(1000) DEFAULT NULL,
  `c_start` mediumtext,
  `c_end` mediumtext,
  `classes_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `info` varchar(1000) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `system` int(11) DEFAULT NULL,
  `w_mouth` varchar(45) DEFAULT NULL,
  `w_written` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `dates`
--

CREATE TABLE `dates` (
  `id` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `d_short` varchar(200) DEFAULT NULL,
  `d_long` varchar(1000) DEFAULT NULL,
  `d_start` mediumtext,
  `d_end` mediumtext,
  `color` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `holidays`
--

CREATE TABLE `holidays` (
  `id` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `h_start` mediumtext,
  `h_end` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `note`
--

CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `classes_id` varchar(45) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `weight` varchar(45) DEFAULT NULL,
  `upcat` varchar(45) DEFAULT NULL,
  `cats_id` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `prename` varchar(200) DEFAULT NULL,
  `info` varchar(1000) DEFAULT NULL,
  `fotolink` varchar(1000) DEFAULT NULL,
  `classes_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `stunote`
--

CREATE TABLE `stunote` (
  `id` int(11) NOT NULL,
  `note_id` varchar(45) DEFAULT NULL,
  `students_id` varchar(45) DEFAULT NULL,
  `classes_id` varchar(45) DEFAULT NULL,
  `note` varchar(45) DEFAULT NULL,
  `info` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `unitdata`
--

CREATE TABLE `unitdata` (
  `id` int(11) NOT NULL,
  `notice` varchar(1000) DEFAULT NULL,
  `attendance` varchar(45) DEFAULT NULL,
  `tolate` varchar(45) DEFAULT NULL,
  `students_id` int(11) DEFAULT NULL,
  `classdates_id` int(11) DEFAULT NULL,
  `classes_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `tempnumb` int(11) DEFAULT NULL,
  `password` varchar(200) NOT NULL,
  `synctarget` varchar(1000) DEFAULT NULL,
  `synctoken` varchar(200) DEFAULT NULL,
  `synctime` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `username`, `tempnumb`, `password`, `synctarget`, `synctoken`, `synctime`) VALUES
(1, 'admin', NULL, 'ab18961bf3f86992a4ebff424508b9d0', '', '', NULL);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `cats`
--
ALTER TABLE `cats`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `classdates`
--
ALTER TABLE `classdates`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `dates`
--
ALTER TABLE `dates`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `stunote`
--
ALTER TABLE `stunote`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `unitdata`
--
ALTER TABLE `unitdata`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `cats`
--
ALTER TABLE `cats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `classdates`
--
ALTER TABLE `classdates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `dates`
--
ALTER TABLE `dates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `holidays`
--
ALTER TABLE `holidays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `stunote`
--
ALTER TABLE `stunote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `unitdata`
--
ALTER TABLE `unitdata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
