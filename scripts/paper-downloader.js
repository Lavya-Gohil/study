const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

/**
 * Web Scraper for Downloading Exam Papers
 * Downloads PDFs from official CBSE, JEE, NEET sources
 */

class PaperDownloader {
  constructor(outputDir = './downloaded_papers') {
    this.outputDir = outputDir;
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  /**
   * Download a single PDF file
   */
  async downloadPDF(url, filename, folder = '') {
    try {
      const outputPath = path.join(this.outputDir, folder);
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
      
      const filePath = path.join(outputPath, filename);
      
      // Check if already downloaded
      if (fs.existsSync(filePath)) {
        console.log(`Already exists: ${filename}`);
        return filePath;
      }
      
      console.log(`Downloading: ${filename}`);
      
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: this.headers,
        timeout: 60000
      });
      
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      
      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`✓ Downloaded: ${filename}`);
          resolve(filePath);
        });
        writer.on('error', reject);
      });
    } catch (error) {
      console.error(`✗ Failed to download ${filename}:`, error.message);
      return null;
    }
  }

  /**
   * Scrape CBSE papers page for download links
   */
  async scrapeCBSEPapers(year, subject) {
    const baseUrl = 'https://cbseacademic.nic.in/PreviousYearPapers.html';
    
    try {
      console.log(`\nScraping CBSE ${subject} papers for ${year}...`);
      
      const response = await axios.get(baseUrl, { headers: this.headers });
      const $ = cheerio.load(response.data);
      
      const links = [];
      
      // Find PDF links matching subject and year
      $('a[href*=".pdf"]').each((i, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().toLowerCase();
        
        if (text.includes(subject.toLowerCase()) && text.includes(year.toString())) {
          links.push({
            url: href.startsWith('http') ? href : `https://cbseacademic.nic.in/${href}`,
            filename: path.basename(href)
          });
        }
      });
      
      return links;
    } catch (error) {
      console.error('Error scraping CBSE:', error.message);
      return [];
    }
  }

  /**
   * Download JEE Main papers from NTA
   */
  async downloadJEEMainPapers(year, subject) {
    console.log(`\nDownloading JEE Main ${subject} papers for ${year}...`);
    
    // Note: These are example URLs - actual URLs need to be verified
    const paperLinks = this.getJEEMainLinks(year, subject);
    
    const folder = `JEE_Main/${year}/${subject}`;
    
    for (const link of paperLinks) {
      await this.downloadPDF(link.url, link.filename, folder);
      await this.delay(2000); // 2 second delay between downloads
    }
  }

  /**
   * Download JEE Advanced papers
   */
  async downloadJEEAdvancedPapers(year, subject) {
    console.log(`\nDownloading JEE Advanced ${subject} papers for ${year}...`);
    
    const paperLinks = this.getJEEAdvancedLinks(year, subject);
    const folder = `JEE_Advanced/${year}/${subject}`;
    
    for (const link of paperLinks) {
      await this.downloadPDF(link.url, link.filename, folder);
      await this.delay(2000);
    }
  }

  /**
   * Download NEET papers
   */
  async downloadNEETPapers(year, subject) {
    console.log(`\nDownloading NEET ${subject} papers for ${year}...`);
    
    const paperLinks = this.getNEETLinks(year, subject);
    const folder = `NEET/${year}/${subject}`;
    
    for (const link of paperLinks) {
      await this.downloadPDF(link.url, link.filename, folder);
      await this.delay(2000);
    }
  }

  /**
   * Get JEE Main paper links
   */
  getJEEMainLinks(year, subject) {
    // Add actual NTA JEE Main URLs here
    // These are placeholders - you'll need to update with real URLs
    return [
      {
        url: `https://jeemain.nta.nic.in/papers/${year}/${subject.toLowerCase()}_paper1.pdf`,
        filename: `JEE_Main_${year}_${subject}_Paper1.pdf`
      },
      {
        url: `https://jeemain.nta.nic.in/papers/${year}/${subject.toLowerCase()}_paper2.pdf`,
        filename: `JEE_Main_${year}_${subject}_Paper2.pdf`
      }
    ];
  }

  /**
   * Get JEE Advanced paper links
   */
  getJEEAdvancedLinks(year, subject) {
    return [
      {
        url: `https://jeeadv.ac.in/past_qps/${year}/${subject.toLowerCase()}_paper1.pdf`,
        filename: `JEE_Advanced_${year}_${subject}_Paper1.pdf`
      },
      {
        url: `https://jeeadv.ac.in/past_qps/${year}/${subject.toLowerCase()}_paper2.pdf`,
        filename: `JEE_Advanced_${year}_${subject}_Paper2.pdf`
      }
    ];
  }

  /**
   * Get NEET paper links
   */
  getNEETLinks(year, subject) {
    return [
      {
        url: `https://neet.nta.nic.in/papers/${year}/${subject.toLowerCase()}.pdf`,
        filename: `NEET_${year}_${subject}.pdf`
      }
    ];
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Download all papers for a given configuration
   */
  async downloadAll(config) {
    const { examTypes, years, subjects } = config;
    
    console.log('Starting bulk download...');
    console.log(`Exam Types: ${examTypes.join(', ')}`);
    console.log(`Years: ${years.join(', ')}`);
    console.log(`Subjects: ${subjects.join(', ')}`);
    
    for (const examType of examTypes) {
      for (const year of years) {
        for (const subject of subjects) {
          try {
            switch (examType) {
              case 'CBSE':
                const links = await this.scrapeCBSEPapers(year, subject);
                for (const link of links) {
                  await this.downloadPDF(link.url, link.filename, `CBSE/${year}/${subject}`);
                  await this.delay(2000);
                }
                break;
              case 'JEE_Main':
                await this.downloadJEEMainPapers(year, subject);
                break;
              case 'JEE_Advanced':
                await this.downloadJEEAdvancedPapers(year, subject);
                break;
              case 'NEET':
                await this.downloadNEETPapers(year, subject);
                break;
            }
          } catch (error) {
            console.error(`Error processing ${examType} ${year} ${subject}:`, error.message);
          }
        }
      }
    }
    
    console.log('\nDownload process completed!');
  }
}

module.exports = PaperDownloader;

// CLI usage
if (require.main === module) {
  const downloader = new PaperDownloader();
  
  console.log('Paper Downloader Ready!');
  console.log('\nUsage:');
  console.log('const downloader = new PaperDownloader("./papers");');
  console.log('downloader.downloadAll({');
  console.log('  examTypes: ["JEE_Main", "CBSE"],');
  console.log('  years: [2024, 2023],');
  console.log('  subjects: ["Physics", "Chemistry", "Mathematics"]');
  console.log('});');
}
