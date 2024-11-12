import React, { Component } from 'react';
import styled from '@emotion/styled';

// Sample Pokemon and Profile types
interface Pokemon {
  id: string;
  name: string;
  url: string;
}

interface Profile {
  id: number;
  name: string;
  iconurl?: string;
}

// Styled components for Profile and Pokemon sections
const SectionContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Card = styled.div<{ selected: boolean }>`
  border: 1px solid ${props => (props.selected ? '#0077FF' : '#ddd')};
  border-radius: 8px;
  padding: 10px;
  width: 150px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
  background-color: ${props => (props.selected ? '#e6f7ff' : 'white')};
  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

class ProfilePokemonApp extends Component {
  state = {
    pokemons: [] as Pokemon[],
    profiles: [] as Profile[],
    selectedProfile: null as Profile | null,
    selectedPokemons: [] as number[],
  };

  componentDidMount() {
    // Fetch profiles and pokemons
    this.fetchProfiles();
    this.fetchPokemons();
  }

  fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/profiles');
      const profiles = await response.json();
      if (profiles.length > 0) {
        // Set the first profile as selected by default
        this.setState({ profiles, selectedProfile: profiles[0] }, () => {
          this.loadProfilePokemons(profiles[0].id);
        });
      } else {
        this.setState({ profiles });
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  fetchPokemons = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pokemon');
      const pokemons = await response.json();
      this.setState({ pokemons });
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    }
  };

  loadProfilePokemons = async (profileId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/profilePokemon?profileId=${profileId}`);
      const selectedPokemonIds = await response.json();
      this.setState({ selectedPokemons: selectedPokemonIds.map((p: any) => p.pokemon.id) });
    } catch (error) {
      console.error('Error fetching profile pokemons:', error);
    }
  };

  handleProfileClick = async (profile: Profile) => {
    // Set the selected profile and load its Pokémon
    this.setState({ selectedProfile: profile, selectedPokemons: [] }, () => {
      this.loadProfilePokemons(profile.id);
    });
  };

  handlePokemonClick = async (pokemon: Pokemon) => {
    const { selectedProfile, selectedPokemons } = this.state;
    if (!selectedProfile) return;

    const isSelected = selectedPokemons.includes(pokemon.id);
    let updatedSelectedPokemons;

    if (isSelected) {
      // Deselect the Pokemon
      updatedSelectedPokemons = selectedPokemons.filter(id => id !== pokemon.id);
    } else {
      // Select the Pokemon if less than 6 are selected
      if (selectedPokemons.length >= 6) {
        alert('You can only select up to 6 Pokémon per profile.');
        return;
      }
      updatedSelectedPokemons = [...selectedPokemons, pokemon.id];
    }

    this.setState({ selectedPokemons: updatedSelectedPokemons });

    // Update the database
    try {
      await fetch(`http://localhost:3000/api/profilePokemon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId: selectedProfile.id, pokemonId: pokemon.id, action: isSelected ? 'remove' : 'add' }),
      });
    } catch (error) {
      console.error('Error updating profile pokemons:', error);
    }
  };

  render() {
    const { profiles, pokemons, selectedProfile, selectedPokemons } = this.state;

    return (
      <div>
        <h2>Profiles</h2>
        <SectionContainer>
          {profiles.map(profile => (
            <Card
              key={profile.id}
              selected={selectedProfile?.id === profile.id}
              onClick={() => this.handleProfileClick(profile)}
            >
              <Image src={profile.iconurl || 'https://via.placeholder.com/100'} alt={profile.name} />
              <h3>{profile.name}</h3>
            </Card>
          ))}
        </SectionContainer>

        <h2>Pokémon</h2>
        <SectionContainer>
          {pokemons.map(pokemon => (
            <Card
              key={pokemon.id}
              selected={selectedPokemons.includes(pokemon.id)}
              onClick={() => this.handlePokemonClick(pokemon)}
            >
              <Image src={pokemon.url} alt={pokemon.name} />
              <h3>{pokemon.name}</h3>
            </Card>
          ))}
        </SectionContainer>
      </div>
    );
  }
}

export default ProfilePokemonApp;

