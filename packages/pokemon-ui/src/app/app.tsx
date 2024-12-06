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

const PaginationButton = styled.button`
  padding: 10px;
  width: 130px;
  color: white;
  background-color: #99bbff;
  border: none;
  border-radius: 5px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => (props.selected ? '#77bbff' : '#99bbff')};
`;

const AddProfileButton = styled.button`
  padding: 10px;
  width: 150px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const OkButton = styled(ModalButton)`
  background-color: #007bff;
  color: white;
`;

const CancelButton = styled(ModalButton)`
  background-color: #6c757d;
  color: white;
`;

class ProfilePokemonApp extends Component {
  state = {
    pokemons: [] as Pokemon[],
    profiles: [] as Profile[],
    selectedProfile: null as Profile | null,
    selectedPokemons: [] as number[],
    displayedPokemons: [] as Pokemon[],
    showAddProfileModal: false,
    newProfileName: '',
    newProfileIconUrl: '',
    start: 0 as number,
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
        // Set the first profile as selected by default and load related Pokémon
        this.setState({ profiles }, () => {
          this.handleProfileClick(profiles[0]);
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
      const { start } = this.state
      const response = await fetch('http://localhost:3000/api/pokemon?start=' + start);
      const pokemons = await response.json();
console.log(`fetchPokemons ${start} ->  ${pokemons[0]}` );
      this.setState({ pokemons, displayedPokemons: [] }, () => {
        this.loadPokemonImagesInBatches();
      });
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    }
  };

  loadPokemonImagesInBatches = () => {
    const { pokemons, displayedPokemons } = this.state;
    const batchSize = 10;
    const currentLength = displayedPokemons.length;
    const nextBatch = pokemons.slice(currentLength, currentLength + batchSize);
    if (nextBatch.length > 0) {
      this.setState({
        displayedPokemons: [...displayedPokemons, ...nextBatch],
      }, () => {
        // Load the next batch after a short delay to avoid overwhelming the server
        setTimeout(this.loadPokemonImagesInBatches, 500);
      });
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

  handleStart = async (start: number) => {
console.log(`handle start, $start` );
    this.setState( { start }, () => { this.fetchPokemons(); } );
  }

  handleAddProfile = () => {
    this.setState({ showAddProfileModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showAddProfileModal: false, newProfileName: '', newProfileIconUrl: '' });
  };

  handleCreateProfile = async () => {
    const { newProfileName, newProfileIconUrl } = this.state;
    if (newProfileName) {
      await this.createProfile({ name: newProfileName, iconurl: newProfileIconUrl });
      this.handleCloseModal();
    }
  };

  createProfile = async (profileData: { name: string; iconurl?: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        const newProfile = await response.json();
        this.setState(prevState => ({
          profiles: [...prevState.profiles, newProfile],
        }));
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
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
    const { profiles, displayedPokemons, selectedProfile, selectedPokemons, showAddProfileModal, newProfileName, newProfileIconUrl, start } = this.state;

    return (
      <div>
        <h2>Profiles</h2>
        <SectionContainer>
          <AddProfileButton onClick={this.handleAddProfile}>+ <br/> Add Profile</AddProfileButton>
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
	  {Array(10).fill().map( (_, i) => (
            <PaginationButton
              selected={start / 50  === i}
	      onClick={() => this.handleStart( i * 50 )}>
	      Group {i + 1}
	    </PaginationButton>
	  ) )}
        </SectionContainer>
        <SectionContainer>
          {displayedPokemons.map(pokemon => (
            <Card
              key={pokemon.id}
              selected={selectedPokemons.includes(pokemon.id)}
              onClick={() => this.handlePokemonClick(pokemon)}
            >
              <Image src={`${pokemon.url}?cache=true`} alt={pokemon.name} loading="lazy" />
              <h3>{pokemon.name}</h3>
            </Card>
          ))}
        </SectionContainer>

        {showAddProfileModal && (
          <ModalOverlay>
            <ModalContent>
              <h3>Add New Profile</h3>
              <InputField
                type="text"
                placeholder="Profile Name"
                value={newProfileName}
                onChange={(e) => this.setState({ newProfileName: e.target.value })}
              />
              <InputField
                type="text"
                placeholder="Icon URL (optional)"
                value={newProfileIconUrl}
                onChange={(e) => this.setState({ newProfileIconUrl: e.target.value })}
              />
              <ButtonContainer>
                <CancelButton onClick={this.handleCloseModal}>Cancel</CancelButton>
                <OkButton onClick={this.handleCreateProfile}>OK</OkButton>
              </ButtonContainer>
            </ModalContent>
          </ModalOverlay>
        )}

      </div>
    );
  }
}

export default ProfilePokemonApp;
