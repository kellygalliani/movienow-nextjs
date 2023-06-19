import React, { useCallback, useMemo } from "react";
import axios from "axios";
import useCurrentUser from "@/hooks/useCurrentUser";
import useFavoriteMovies from "@/hooks/useFavoriteMovies";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";

interface ButtonFavoriteProps {
  movieId: string;
}
const FavoriteButton = ({ movieId }: ButtonFavoriteProps) => {
  const { mutate: mutateFavorites } = useFavoriteMovies();
  const { data: currentUser, mutate } = useCurrentUser();

  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(movieId);
  }, [currentUser, movieId]);

  const toogleFavorites = useCallback(async () => {
    let response;
    if (isFavorite) {
      response = await axios.patch(`/api/favorite`, { movieId });
    } else {
      response = await axios.post("/api/favorite", { movieId });
    }

    const updatedFavoriteIds = response?.data?.favoriteIds;

    mutate({
      ...currentUser,
      favoriteIds: updatedFavoriteIds,
    });

    mutateFavorites();
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;
  return (
    <div
      className="
    cursor-pointer
    group/item
    w-6
    h-6
    lg:w-10
    lg:h-10
    border-white
    border-2
    rounded-full
    flex
    justify-center
    items-center
    transition
    hover:border-neutral-300
    "
      onClick={toogleFavorites}
    >
      <Icon className="text-white" size={25} />
    </div>
  );
};

export default FavoriteButton;
