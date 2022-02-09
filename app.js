const fsPromises = require('fs').promises;
const { performance } = require('perf_hooks');
const findDataPath = 'find_words.txt';
const dictionaryDataPath = 'french_dictionary.csv';
const resultDataPath = 'frequency.csv';
const frenchDataPath = 't8.shakespeare.translated.txt';
const performanceDataPath = 'performance.txt'

const fileOutPut = async () => {

    try {
        // for time calculation start
        let startTime = performance.now()

        const findData = await fsPromises.readFile(findDataPath, 'utf8')
        const dictionaryData = await fsPromises.readFile(dictionaryDataPath, 'utf8')
        let writeString = 'English word,French word,Frequency\n'
        let frenchString = '';
        let performanceString = '';
        let findDataObject = {};

        const findDataArray = await findData.split('\n');
        //    for the frequency
        await findDataArray.map(FDA => {
            let elementName = FDA;
            if (findDataObject.hasOwnProperty(elementName)) {

                findDataObject[elementName] = findDataObject[elementName] + 1
            } else {
                findDataObject[elementName] = 1;
            }
        })


        const dictionaryDataArray = await dictionaryData.split('\n')
        const dictionaryEngWord = [];
        const dictionaryFrnWord = [];
        await dictionaryDataArray.map(dda => {
            const sliptDDA = dda.split(',');
            dictionaryEngWord.push(sliptDDA[0])
            dictionaryFrnWord.push(sliptDDA[1])
        })
        // console.log(dictionaryEngWord)
        // console.log(dictionaryFrnWord)
        await findDataArray.map((fda) => {
            const index = dictionaryEngWord.indexOf(fda);
            if (index !== -1 && findDataObject[fda] !== -2) {
                writeString = writeString.concat(`${dictionaryDataArray[index]},${findDataObject[fda]}\n`)
                // for remove duplicate element
                findDataObject[fda] = -2;
                frenchString = frenchString.concat(`${dictionaryFrnWord[index]}\n`)
            }
        })
        await fsPromises.writeFile(resultDataPath, writeString)
        await fsPromises.writeFile(frenchDataPath, frenchString)
        //
        let endTime = performance.now()
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        performanceString = `Time to process: 0 minutes ${(endTime - startTime)/1000} seconds\nMemory used: ${Math.round(used * 100) / 100} MB`
        await fsPromises.writeFile(performanceDataPath, performanceString)

    } catch (err) {
        console.error(err);
    }

}
fileOutPut()