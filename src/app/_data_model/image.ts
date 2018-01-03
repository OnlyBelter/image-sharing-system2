export class Image {

  constructor(
    public id: number,
    public created: string,  // set by back end
    public userId: number,
    public owner: string,
    public fileUrl?: string,
    public des?: string,
    public localImage?: File,
  ) { }

}