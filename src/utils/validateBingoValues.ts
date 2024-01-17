export default (bingoValues: Array<Array<boolean>>): boolean => {
  let bingoFoundInDiag1 = true;
  let bingoFoundInDiag2 = true;

  for (let rowIndex = 0; rowIndex < bingoValues.length; rowIndex++) {
    let bingoFoundInRow = true;
    let bingoFoundInColumn = true;

    for (
      let columnIndex = 0;
      columnIndex < bingoValues[rowIndex].length;
      columnIndex++
    ) {
      // Check each row and column
      if (!bingoValues[rowIndex][columnIndex]) bingoFoundInRow = false;
      if (!bingoValues[columnIndex][rowIndex]) bingoFoundInColumn = false;
    }

    // Check diagonals
    if (!bingoValues[rowIndex][rowIndex]) bingoFoundInDiag1 = false;
    if (!bingoValues[rowIndex][bingoValues.length - 1 - rowIndex])
      bingoFoundInDiag2 = false;

    // Check if any row or column has bingo
    if (bingoFoundInRow || bingoFoundInColumn) return true;
  }
  // Check if any diagonal has bingo
  return bingoFoundInDiag1 || bingoFoundInDiag2;
};

export function validateLobbyHoeBingo(
  bingoValues: Array<Array<boolean>>,
): boolean {
  const lobbyHoeSymbolLayout = [
    [0, 0],
    [0, 4],
    [1, 0],
    [1, 4],
    [2, 0],
    [2, 2],
    [2, 3],
    [2, 4],
    [3, 0],
    [3, 4],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 4],
  ];
  let found = true;
  lobbyHoeSymbolLayout.forEach((coordinate) => {
    if (!bingoValues[coordinate[0]][coordinate[1]]) found = false;
  });
  return found;
}
