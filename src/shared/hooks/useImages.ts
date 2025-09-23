export function useImages() {
  console.log("useImages - UI 테스트용 Mock Hook");

  return {
    images: [],
    loading: false,
    error: null,
    hasMore: false,
    loadMore: () => console.log("loadMore - UI 테스트용 Mock"),
    refresh: () => console.log("refresh - UI 테스트용 Mock"),
  };
}

export function useImageDetail(_imageId: string) {
  console.log("useImageDetail - UI 테스트용 Mock Hook");

  return {
    image: null,
    loading: false,
    error: null,
  };
}

export function useImageSearch() {
  console.log("useImageSearch - UI 테스트용 Mock Hook");

  return {
    searchResults: [],
    loading: false,
    error: null,
    searchImages: () => console.log("searchImages - UI 테스트용 Mock"),
    clearSearch: () => console.log("clearSearch - UI 테스트용 Mock"),
  };
}
