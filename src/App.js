import React, { useState } from "react";
import {
  Plus,
  Trophy,
  Users,
  Calendar,
  Award,
  Trash2,
  Edit3,
  Check,
  X,
} from "lucide-react";

const App = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: "Marco", points: 0 },
    { id: 2, name: "Luca", points: 0 },
    { id: 3, name: "Andrea", points: 0 },
    { id: 4, name: "Francesco", points: 0 },
  ]);

  const [matches, setMatches] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [matchDate, setMatchDate] = useState("");
  const [matchResult, setMatchResult] = useState("");
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamAName, setTeamAName] = useState("Equipo A");
  const [teamBName, setTeamBName] = useState("Equipo B");
  const [editingTeamA, setEditingTeamA] = useState(false);
  const [editingTeamB, setEditingTeamB] = useState(false);
  const [tempTeamAName, setTempTeamAName] = useState("");
  const [tempTeamBName, setTempTeamBName] = useState("");
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editName, setEditName] = useState("");
  const [activeTab, setActiveTab] = useState("matches");

  // --- Funzioni ---
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([
        ...players,
        { id: Date.now(), name: newPlayerName.trim(), points: 0 },
      ]);
      setNewPlayerName("");
    }
  };

  const deletePlayer = (playerId) => {
    setPlayers(players.filter((p) => p.id !== playerId));
    setSelectedWinners(selectedWinners.filter((id) => id !== playerId));
  };

  const startEditPlayer = (player) => {
    setEditingPlayer(player.id);
    setEditName(player.name);
  };
  const saveEditPlayer = () => {
    if (editName.trim()) {
      setPlayers(
        players.map((p) =>
          p.id === editingPlayer ? { ...p, name: editName.trim() } : p
        )
      );
    }
    setEditingPlayer(null);
    setEditName("");
  };
  const cancelEditPlayer = () => {
    setEditingPlayer(null);
    setEditName("");
  };

  const startEditTeam = (team) => {
    if (team === "A") {
      setEditingTeamA(true);
      setTempTeamAName(teamAName);
    } else {
      setEditingTeamB(true);
      setTempTeamBName(teamBName);
    }
  };

  const saveTeamName = (team) => {
    if (team === "A" && tempTeamAName.trim()) {
      setTeamAName(tempTeamAName.trim());
      setEditingTeamA(false);
    } else if (team === "B" && tempTeamBName.trim()) {
      setTeamBName(tempTeamBName.trim());
      setEditingTeamB(false);
    }
  };

  const cancelEditTeam = (team) => {
    if (team === "A") {
      setEditingTeamA(false);
      setTempTeamAName("");
    } else {
      setEditingTeamB(false);
      setTempTeamBName("");
    }
  };

  const addToTeam = (playerId, team) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    if (
      team === "A" &&
      teamA.length < 5 &&
      !teamA.some((p) => p.id === playerId) &&
      !teamB.some((p) => p.id === playerId)
    ) {
      setTeamA([...teamA, player]);
    }
    if (
      team === "B" &&
      teamB.length < 5 &&
      !teamB.some((p) => p.id === playerId) &&
      !teamA.some((p) => p.id === playerId)
    ) {
      setTeamB([...teamB, player]);
    }
  };

  const removeFromTeam = (playerId, team) => {
    if (team === "A") {
      setTeamA(teamA.filter((p) => p.id !== playerId));
    } else {
      setTeamB(teamB.filter((p) => p.id !== playerId));
    }
  };

  const selectWinningTeam = (team) => {
    setSelectedWinners(
      team === "A" ? teamA.map((p) => p.id) : teamB.map((p) => p.id)
    );
  };

  const addMatch = () => {
    if (
      selectedWinners.length === 0 ||
      !matchDate ||
      !matchResult.trim() ||
      teamA.length === 0 ||
      teamB.length === 0
    ) {
      alert("Completa tutti i campi e seleziona il vincitore!");
      return;
    }
    const newMatch = {
      id: Date.now(),
      date: matchDate,
      result: matchResult.trim(),
      teamA: [...teamA],
      teamB: [...teamB],
      teamAName,
      teamBName,
      winners: selectedWinners.map((id) => ({
        id,
        name: players.find((p) => p.id === id)?.name,
      })),
    };
    setPlayers((prev) =>
      prev.map((p) =>
        selectedWinners.includes(p.id) ? { ...p, points: p.points + 1 } : p
      )
    );
    setMatches([newMatch, ...matches]);
    setSelectedWinners([]);
    setTeamA([]);
    setTeamB([]);
    setMatchDate("");
    setMatchResult("");
  };

  const deleteMatch = (matchId) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;
    setPlayers((prev) =>
      prev.map((p) =>
        match.winners.some((w) => w.id === p.id)
          ? { ...p, points: Math.max(0, p.points - 1) }
          : p
      )
    );
    setMatches(matches.filter((m) => m.id !== matchId));
  };

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6 md:p-8 w-full">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-8 h-8" />{" "}
            <h1 className="text-xl sm:text-2xl font-bold">
              Liga de Fútbol Miércoles
            </h1>
          </div>
          <p className="text-sm sm:text-base text-green-100">
            ¡Lleva el control de las victorias y descubre quién es el campeón!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row border-b">
          <button
            onClick={() => setActiveTab("matches")}
            className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 font-semibold flex items-center justify-center gap-2 ${
              activeTab === "matches"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Calendar className="w-5 h-5" /> Agregar Partido
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 font-semibold flex items-center justify-center gap-2 ${
              activeTab === "leaderboard"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Award className="w-5 h-5" /> Clasificación
          </button>
          <button
            onClick={() => setActiveTab("players")}
            className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 font-semibold flex items-center justify-center gap-2 ${
              activeTab === "players"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users className="w-5 h-5" /> Gestionar Jugadores
          </button>
        </div>

        {/* Contenuti Tab */}
        <div className="p-4 sm:p-6 space-y-6">
          {activeTab === "matches" && (
            <div className="space-y-6">
              {/* Form Partita */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl">
                <input
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Resultado (ej: 3-2)"
                  value={matchResult}
                  onChange={(e) => setMatchResult(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Squadre con modifica nome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team A */}
                <div className="bg-blue-50 p-3 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    {editingTeamA ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={tempTeamAName}
                          onChange={(e) => setTempTeamAName(e.target.value)}
                          className="flex-1 p-1 border rounded"
                        />
                        <button
                          onClick={() => saveTeamName("A")}
                          className="text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cancelEditTeam("A")}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <h4 className="font-bold text-blue-800">{teamAName}</h4>
                        <button
                          onClick={() => startEditTeam("A")}
                          className="text-blue-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {teamA.map((p) => (
                      <span
                        key={p.id}
                        className="bg-blue-200 px-2 py-1 rounded"
                      >
                        {p.name}{" "}
                        <X
                          className="inline w-3 h-3 cursor-pointer"
                          onClick={() => removeFromTeam(p.id, "A")}
                        />
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {players
                      .filter((p) => !teamA.includes(p) && !teamB.includes(p))
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => addToTeam(p.id, "A")}
                          className="bg-white border px-2 py-1 rounded"
                        >
                          {p.name}
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={() => selectWinningTeam("A")}
                    className="mt-2 w-full bg-blue-500 text-white py-2 rounded"
                  >
                    {selectedWinners.every((id) =>
                      teamA.some((p) => p.id === id)
                    )
                      ? "¡GANADOR!"
                      : `Equipo A Ganador`}
                  </button>
                </div>

                {/* Team B */}
                <div className="bg-red-50 p-3 rounded-xl border-2 border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    {editingTeamB ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={tempTeamBName}
                          onChange={(e) => setTempTeamBName(e.target.value)}
                          className="flex-1 p-1 border rounded"
                        />
                        <button
                          onClick={() => saveTeamName("B")}
                          className="text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cancelEditTeam("B")}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <h4 className="font-bold text-red-800">{teamBName}</h4>
                        <button
                          onClick={() => startEditTeam("B")}
                          className="text-red-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {teamB.map((p) => (
                      <span key={p.id} className="bg-red-200 px-2 py-1 rounded">
                        {p.name}{" "}
                        <X
                          className="inline w-3 h-3 cursor-pointer"
                          onClick={() => removeFromTeam(p.id, "B")}
                        />
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {players
                      .filter((p) => !teamA.includes(p) && !teamB.includes(p))
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => addToTeam(p.id, "B")}
                          className="bg-white border px-2 py-1 rounded"
                        >
                          {p.name}
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={() => selectWinningTeam("B")}
                    className="mt-2 w-full bg-red-500 text-white py-2 rounded"
                  >
                    {selectedWinners.every((id) =>
                      teamB.some((p) => p.id === id)
                    )
                      ? "¡GANADOR!"
                      : `Equipo B Ganador`}
                  </button>
                </div>
              </div>

              <button
                onClick={addMatch}
                className="w-full bg-green-500 text-white py-3 rounded-lg flex justify-center items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Agregar Partido
              </button>

              {/* Lista Match */}
              <div>
                {matches.map((m) => (
                  <div key={m.id} className="p-3 border rounded mb-2">
                    <div className="flex justify-between items-center">
                      <span>
                        {m.teamAName} vs {m.teamBName} - {m.result}
                      </span>
                      <button onClick={() => deleteMatch(m.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div>
              {sortedPlayers.map((p, idx) => (
                <div key={p.id} className="flex justify-between border-b py-2">
                  {idx + 1}. {p.name} <span>{p.points} victorias</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "players" && (
            <div>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Nombre del jugador"
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={addPlayer}
                className="w-full bg-purple-500 text-white py-2 rounded flex justify-center items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Agregar
              </button>
              <div className="mt-2 space-y-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center border p-1 rounded"
                  >
                    {p.name}{" "}
                    <button
                      onClick={() => deletePlayer(p.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
