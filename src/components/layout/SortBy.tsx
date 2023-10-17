import React from 'react'

const SortBy = (this.props.first) => {

    const handleChangeSort = (e: React.ChangeEvent<HTMLInputElement>) => {

        let input = e.target.id

        if (input === "alphaAz") {
            setFilteredGames([...filteredGames].sort((a, b) => a.title.localeCompare(b.title)))
        }
        if (input === "alphaZa") {
            setFilteredGames([...filteredGames].sort((a, b) => b.title.localeCompare(a.title)))
        }
        if (input === "complexityAsc") {
            setFilteredGames([...filteredGames].sort((a, b) => a.complexity - b.complexity))
        }
        if (input === "complexityDesc") {
            setFilteredGames([...filteredGames].sort((a, b) => b.complexity - a.complexity))
        }
        if (input === "minPlayers") {
            setFilteredGames([...filteredGames].sort((a, b) => a.minPlayers - b.minPlayers))
        }
        if (input === "maxPlayers") {
            setFilteredGames([...filteredGames].sort((a, b) => a.maxPlayers - b.maxPlayers))
        }

    }
    return (
        <div>SortBy</div>
    )
}

export default SortBy